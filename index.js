var request = require("request"),
	cheerio = require("cheerio"),
	Q = require("q"),
	ent = require('ent'),
	merge = require('deepmerge'),
	pISBN = "9789571358512";

function getFromKingstone(pISBN) {
	var domain = "http://m.kingstone.com.tw";
	var searchUrl = "/search.asp?q=";
	var bookObj = {};
	var deferred = Q.defer();

	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $("#team .row .media-heading a").eq(0);
			var targetUrl = $(link).attr("href");
				
			if (link.length > 0) {
				request(domain + targetUrl, function (error, response, body) {
					if (!error) {
						var $ = cheerio.load(body);
						bookObj.Title = [$("#team .media-heading").text()];
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
									bookObj.Language = [content];
									break;
								case "規格":
									bookObj.Spec = [content];
									break;
								case "出版日":
									bookObj.PublishDate = [content];
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

	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $(".main .item a.item-name").eq(0);
			var targetUrl = $(link).attr("href");
			
			if (link.length > 0) {
				request(targetUrl, function (error, response, body) {
					if (!error) {
						var $ = cheerio.load(body);
						bookObj.Title = [$(".main .dt-book h1.item-name").text()];
						bookObj.SubTitle = [$(".main .dt-book h2.item-name").text()];
						bookObj.ImageUrl = [$(".main .dt-book .img-box img").attr("src")];
						var infos = ent.decode($(".main .intro-wrap section .cont").html()).trim().split("<br>");
						for(var i = 0; i < infos.length; i++) {
							var text = infos[i].split("：");
							if (text.length != 2) continue;
								var title = text[0].replace(/\s/g,""),
									content = text[1].trim().replace(/\s+/g," ");

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
									bookObj.Spec = [content];
									break;
								case "出版日期":
									bookObj.PublishDate = [content];
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
								bookObj.PublishDate = [text.split("／")[1].trim()];
							} else if (text.indexOf("商品語言") != -1) {
								bookObj.Language = [text.split("／")[1].trim()];
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
								bookObj.Pages = [$("span",info).eq(1).text()];
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
						bookObj.Title = [$("#mainContainer .bookDetailWrapper .rightDetails .title h1").text()];
						var infos = $("#mainContainer .bookDetailWrapper .rightDetails .details table tr");
						infos.each(function(i, info) {
							var text = $("th", info).text();
							if (text.indexOf("叢書") != -1) {
								bookObj.Series = [$("td", info).text()];
							} else if (text.indexOf("作者") != -1) {
								bookObj.Author = [$("td", info).text()];
							} else if (text.indexOf("譯者") != -1) {
								bookObj.Translater = [$("td", info).text()];
							} else if (text.indexOf("出版社") != -1) {
								bookObj.Publisher = [$("td", info).text()];
							} else if (text.indexOf("出版日期") != -1) {
								bookObj.PublishDate = [$("td", info).text()];
							} else if (text.indexOf("ISBN") != -1) {
								bookObj.ISBN = [$("td", info).text()];
							} else if (text.indexOf("語言") != -1) {
								bookObj.Language = [$("td", info).text()];
							} else if (text.indexOf("頁數") != -1) {
								bookObj.Pages = [$("td", info).text()];
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

			bookObj.Title = [$("#mainPanel #rightPanel #productInfo_table td.productName").text().replace(/[《》]/gi,"")];
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
					bookObj.PublishDate = [value];
				} else if (text.indexOf("語言版本") != -1) {
					bookObj.Language = [value];
				} else if (text.indexOf("頁數") != -1) {
					bookObj.Pages = [value];
				} else if (text.indexOf("裝幀") != -1) {
					bookObj.Spec = [value];
				} else if (text.indexOf("叢書/系列") != -1) {
					bookObj.Series = [value];
				}
			});

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

pISBN = process.argv[2] || pISBN;

Q.all([getFromKingstone(pISBN), getFromEslite(pISBN), getFromBooks(pISBN), getFromJointPublishing(pISBN), getFromCommercialPress(pISBN)])
.spread(function(x, y, z, a, b) {
	console.dir(merge(x, merge(y, merge(z, merge(a, b)))));
})
.done();



