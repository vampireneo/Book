var express = require('express'),
	request = require("request"),
	cheerio = require("cheerio"),
	moment = require('moment'),
	Q = require("q"),
	ent = require('ent'),
	merge = require('./merge.js'),
	pISBN = "9789571358512",
	app = express();

function getFromKingstone(pISBN) {
	var domain = "http://m.kingstone.com.tw";
	var searchUrl = "/search.asp?q=";
	var bookObj = {};
	var deferred = Q.defer();

	//console.log("get url: " + domain + searchUrl + pISBN);
	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $("#team .row .media-heading a").eq(0);
			var targetUrl = $(link).attr("href");
				
			if (link.length > 0) {
				//console.log("get url: " + domain + targetUrl);
				request(domain + targetUrl, function (error, response, body) {
					if (!error) {
						var $ = cheerio.load(body);
						bookObj.source = [domain + targetUrl];
						bookObj.Title = [$("#team .media-heading").text().trim()];
						bookObj.ImageUrl = [$("#team .pull-left .img-thumbnail").attr("src")];
						bookObj.Author = [$("#team .m_author").eq(0).text().trim()];
						bookObj.Publisher = [$("#team .m_author").eq(1).text().trim()];
						var infos = ent.decode($("#collapseTwo p").html()).trim().split("<br>");
						for(var i = 0; i < infos.length; i++) {
							var text = infos[i].split("：");
							if (text.length != 2) continue;
								var title = text[0],
									content = text[1].trim();

							switch(title) {
								case "ISBN":
									bookObj.ISBN = [content];
									break;
								case "出版社":
									bookObj.Publisher = [content];
									break;
								case "編／譯者":
									bookObj.Translater = [content];
									break;
								case "語言":
									bookObj.Language = [content.replace("中文繁體", "繁體中文")];
									break;
								case "規格":
									bookObj.Spec = [content];
									break;
								case "出版日":
									bookObj.PublishDate = [moment(content,"YYYY/MM/DD").toDate()];
									break;
							}
						}
						//console.log(bookObj);
						deferred.resolve(bookObj);
					} else {
						//console.log("We’ve encountered an error: " + error);
						//deferred.reject(error);
						deferred.resolve(bookObj);
					}
				});
			}
			else deferred.resolve(bookObj);
		} else {
			//console.log("We’ve encountered an error: " + error);
			//deferred.reject(error);
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
}

function getFromBooks(pISBN) {
	var domain = "http://m.books.com.tw";
	var searchUrl = "/search?key=";
	var bookObj = {};
	var deferred = Q.defer();

	//console.log("get url: " + domain + searchUrl + pISBN);
	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $(".main .item a.item-name").eq(0);
			var targetUrl = $(link).attr("href");
			
			if (link.length > 0) {
				//console.log("get url: " + targetUrl);
				request(targetUrl, function (error, response, body) {
					if (!error) {
						var $ = cheerio.load(body);
						bookObj.source = [targetUrl];
						bookObj.Title = [$(".main .dt-book h1.item-name").text().trim()];
						bookObj.SubTitle = [$(".main .dt-book h2.item-name").text().trim()];
						bookObj.ImageUrl = [$(".main .dt-book .img-box img").attr("src").replace(/http:\/\/im2.book.com.tw\/image\/getImage\?i=/,'').replace(/&v=.*/,'')];
						var infos = ent.decode($(".main .intro-wrap section .cont").html()).trim().split("<br>");
						for(var i = 0; i < infos.length; i++) {
							var text = infos[i].split("：");
							if (text.length != 2) continue;
								var title = text[0].replace(/\s/g,"").trim(),
									content = text[1].trim().replace(/\s+/g," ").trim().replace(/‧/g,"．");

							switch(title) {
								case "作者":
									bookObj.Author = [content];
									break;
								case "ISBN":
									bookObj.ISBN = [content];
									break;
								case "出版社":
									bookObj.Publisher = [content];
									break;
								case "叢書系列":
									bookObj.Series = [content];
									break;
								case "語言":
									bookObj.Language = [content];
									break;
								case "規格":
									var contents = content.split("/");
									bookObj.Spec = [contents[0].trim()];
									bookObj.Pages = [contents[1].replace("頁","").trim()];
									break;
								case "出版日期":
									bookObj.PublishDate = [moment(content,"YYYY年MM月DD日").toDate()];
									break;
							}
						}
						//console.log(bookObj);
						deferred.resolve(bookObj);
					} else {
						//console.log("We’ve encountered an error: " + error);
						//deferred.reject(error);
						deferred.resolve(bookObj);
					}
				});
			}
			else deferred.resolve(bookObj);
		} else {
			//console.log("We’ve encountered an error: " + error);
			//deferred.reject(error);
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
}

function getFromEslite(pISBN) {
	var domain = "http://www.eslite.com/";
	var searchUrl = "Search_BW.aspx?query=";
	var bookObj = {};
	var deferred = Q.defer();

	request({url:domain + searchUrl + pISBN, tunnel: true}, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $("#search_content td.name h3 a").eq(0);

			if (link.length > 0) {
				var targetUrl = $(link).attr("href");

				request(domain + targetUrl, function (error, response, body) {
					if (!error) {
						var $ = cheerio.load(body);
						bookObj.source = [domain + targetUrl];
						bookObj.Title = [$("#content h1 span").eq(0).text().trim()];
						bookObj.SubTitle = [$("#content h1 span").eq(1).text().trim()];
						bookObj.ImageUrl = [$("#mainlink img").attr("src")];
						var infos = $("#content h3");
						infos.each(function(i, info) {
							var text = $(info).text();
							if (text.indexOf("作者") != -1) {
								bookObj.Author = [$("a", info).eq(0).text().trim()];
							} else if (text.indexOf("譯者") != -1) {
								bookObj.Translater = [$("a", info).eq(0).text().trim()];
							} else if (text.indexOf("出版社") != -1) {
								bookObj.Publisher = [$("a", info).eq(0).text().trim()];
							} else if (text.indexOf("出版日期") != -1) {
								bookObj.PublishDate = [moment(text.split("／")[1].trim(),"YYYY/MM/DD").toDate()];
							} else if (text.indexOf("商品語言") != -1) {
								bookObj.Language = [text.split("／")[1].trim().replace("中文/繁體", "繁體中文")];
							} else if (text.indexOf("裝訂") != -1) {
								bookObj.Spec = [text.split("／")[1].trim()];
							}
						});
						infos = $("#content .C_box p").text().split("\n");
						for(var i = 0; i < infos.length; i++) {
							if (infos[i].indexOf("ISBN 13") > -1) {
								bookObj.ISBN = [infos[i].split("／")[1].trim()];
							}
						}
						infos = $("#content .C_box table[id*='dlSpec'] td");
						infos.each(function(i, info) {
							var text = $("span",info).eq(0).text();
							if (text.indexOf("頁數") != -1) {
								bookObj.Pages = [$("span",info).eq(1).text().trim()];
							}
						});

						//console.log(bookObj);
						deferred.resolve(bookObj);
					} else {
						//console.log("We’ve encountered an error: " + error);
						//deferred.reject(error);
						deferred.resolve(bookObj);
					}
				});
			}
			else deferred.resolve(bookObj);
		} else {
			//console.log("We’ve encountered an error: " + error);
			//deferred.reject(error);
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
}

function getFromJointPublishing(pISBN) {
	var domain = "http://www.jointpublishing.com";
	var searchUrl = "/Special-Page/search-result.aspx?searchmode=anyword&searchtext=";
	var bookObj = {};
	var deferred = Q.defer();

	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $("#mainContainer .contentPart div a").eq(0);
			if (link.length > 0) {
				var targetUrl = $(link).attr("href");
					
				//console.log("Target URL is: " + targetUrl);
				request(targetUrl, function (error, response, body) {
					if (!error) {
						var $ = cheerio.load(body);
						bookObj.source = [targetUrl];
						bookObj.Title = [$("#mainContainer .bookDetailWrapper .rightDetails .title h1").text().trim()];
						var infos = $("#mainContainer .bookDetailWrapper .rightDetails .details table tr");
						infos.each(function(i, info) {
							var text = $("th", info).text();
							var content = $("td", info).text().trim();
							if (text.indexOf("叢書") != -1) {
								bookObj.Series = [content];
							} else if (text.indexOf("作者") != -1) {
								bookObj.Author = [content];
							} else if (text.indexOf("譯者") != -1) {
								bookObj.Translater = [content];
							} else if (text.indexOf("出版社") != -1) {
								bookObj.Publisher = [content];
							} else if (text.indexOf("出版日期") != -1) {
								bookObj.PublishDate = [moment(content,"YYYY/MM/DD").toDate()];
							} else if (text.indexOf("ISBN") != -1) {
								bookObj.ISBN = [content];
							} else if (text.indexOf("語言") != -1) {
								bookObj.Language = [content.replace("中文(繁)", "繁體中文")];
							} else if (text.indexOf("頁數") != -1) {
								var page = content.replace(/頁/g,"").trim();
								if (page != "0")
									bookObj.Pages = [page];
							}
						});
						//console.log(bookObj);
						deferred.resolve(bookObj);
					} else {
						//console.log("We’ve encountered an error: " + error);
						//deferred.reject(error);
						deferred.resolve(bookObj);
					}
				});
			}
			else deferred.resolve(bookObj);
		} else {
			//console.log("We’ve encountered an error: " + error);
			//deferred.reject(error);
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
}

function getFromCommercialPress(pISBN) {
	var searchUrl = "http://www.cp1897.com.hk/product_info.php?BookId=";
	var bookObj = {};
	var deferred = Q.defer();

	request(searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			bookObj.source = [searchUrl + pISBN];
			bookObj.Title = [$("#mainPanel #rightPanel #productInfo_table td.productName").text().replace(/[《》]/gi,"")];
			if (bookObj.Title[0].indexOf("對不起！") === -1) {
				var infos = $("#mainPanel #rightPanel #productInfo_table tr");
				infos.each(function(i, info) {
					var text = $("td.productLabel", info).text();
					var value = $("td.productDesc", info).text().trim();
					if (text.indexOf("作者") != -1) {
						bookObj.Author = [value];
					} else if (text.indexOf("譯者") != -1) {
						bookObj.Translater = [value];
					} else if (text.indexOf("出版社") != -1) {
						bookObj.Publisher = [value];
					} else if (text.indexOf("ISBN") != -1) {
						bookObj.ISBN = [value];
					}
				});

				var infos = $("#mainPanel #rightPanel #extraInfo_table tr");
				infos.each(function(i, info) {
					var text = $("td.productLabel", info).text();
					var value = $("td.productDesc", info).text().trim();
					if (text.indexOf("出版日期") != -1) {
						bookObj.PublishDate = [moment(value,"YYYY年MM月").toDate()];
					} else if (text.indexOf("語言版本") != -1) {
						bookObj.Language = [value.replace("中文(繁)", "繁體中文")];
					} else if (text.indexOf("頁數") != -1) {
						bookObj.Pages = [value.replace(/頁/g,"").trim()];
					} else if (text.indexOf("裝幀") != -1) {
						bookObj.Spec = [value];
					} else if (text.indexOf("叢書/系列") != -1) {
						bookObj.Series = [value];
					}
				});
			}
			else {
				bookObj = {};
			}
			//console.log(bookObj);
			//deferred.resolve(bookObj);
			deferred.resolve(bookObj);
		} else {
			//console.log("We’ve encountered an error: " + error);
			//deferred.reject(error);
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
}

exports.start = function(portNo) {
	app.get('/isbn/:id([0-9]+)', function(req, res){
		var isbn = req.params.id;

		console.log("Get book info with isbn " + isbn);

		Q.all([getFromKingstone(isbn), getFromEslite(isbn), getFromBooks(isbn), getFromJointPublishing(isbn), getFromCommercialPress(isbn)])
		.spread(function(x, y, z, a, b) {
			var result = merge(x, merge(y, merge(z, merge(a, b))));
			res.json(result);
		})
		.done();
	});

	app.get('/isbn/', function(req, res){
	  res.redirect('/isbn/' + pISBN);
	});

	app.get('/', function (req, res) {
	  //res.send('Hello World!');
	  res.redirect('/isbn/' + pISBN);
	});

	var server = app.listen(portNo, function () {

	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Listening at http://%s:%s', host, port);

	});
}
