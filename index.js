var request = require("request"),
	cheerio = require("cheerio"),
	ent = require('ent'),
	pISBN = "9789571358512";

function getFromKingstone2(pISBN) {
	var domain = "http://www.kingstone.com.tw";
	var searchUrl = "/search/result.asp?q_type=isbn&c_name1=";
	var bookObj = {};

	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $("#mainContent ul a.anchor").eq(0);
			var targetUrl = $(link).attr("href");
				
			//console.log("Target URL is: " + targetUrl);
			request(domain + targetUrl, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body);
					bookObj.Title = $("head meta[property='og:title']").attr("content").replace("-金石堂網路書店", "");
					bookObj.ImageUrl = $("head meta[property='og:image']").attr("content");
					var Author, isbn, publisher, publishDate, translater;
					var infos = $(".item_info li");
					infos.each(function(i, info) {
						var text = $("span", info).text();
						if (text.indexOf("作者：") != -1) {
							bookObj.Author = $("em", info).text();
						} else if (text.indexOf("ISBN：") != -1) {
							bookObj.ISBN = $("em", info).text();
						} else if (text.indexOf("出版社：") != -1) {
							bookObj.Publisher = $("em", info).text().trim();
						} else if (text.indexOf("譯者：") != -1) {
							bookObj.Translater = $("em", info).text().trim();
						} else if (text.indexOf("出版日：") != -1) {
							bookObj.PublishDate = $("em", info).text();
						}
					});
					console.log(bookObj);
				} else {
					console.log("We’ve encountered an error: " + error);
				}
			});
		} else {
			console.log("We’ve encountered an error: " + error);
		}
	});
}
	
function getFromKingstone(pISBN) {
	var domain = "http://m.kingstone.com.tw";
	var searchUrl = "/search.asp?q=";
	var bookObj = {};

	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $("#team .row .media-heading a").eq(0);
			var targetUrl = $(link).attr("href");
				
			//console.log("Target URL is: " + targetUrl);
			request(domain + targetUrl, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body);
					bookObj.Title = $("#team .media-heading").text();
					bookObj.ImageUrl = $("#team .pull-left .img-thumbnail").attr("src");
					bookObj.Author = $("#team .m_author").eq(0).text().trim();
					bookObj.Publisher = $("#team .m_author").eq(1).text().trim();
					var infos = ent.decode($("#collapseTwo p").html()).trim().split("<br>");
					for(var i = 0; i < infos.length; i++) {
						var text = infos[i].split("：");
						if (text.length != 2) continue;
							var title = text[0],
								content = text[1].trim();

						switch(title) {
							case "ISBN":
								bookObj.ISBN = content;
								break;
							case "出版社":
								bookObj.Publisher = content;
								break;
							case "編／譯者":
								bookObj.Translater = content;
								break;
							case "語言":
								bookObj.Language = content;
								break;
							case "規格":
								bookObj.Spec = content;
								break;
							case "出版日":
								bookObj.PublishDate = content;
								break;
						}
					}
					console.log(bookObj);
				} else {
					console.log("We’ve encountered an error: " + error);
				}
			});
		} else {
			console.log("We’ve encountered an error: " + error);
		}
	});
}

function getFromBooks(pISBN) {
	var domain = "http://m.books.com.tw";
	var searchUrl = "/search?key=";
	var bookObj = {};

	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $(".main .item a.item-name").eq(0);
			var targetUrl = $(link).attr("href");
				
			//console.log("Target URL is: " + targetUrl);
			request(targetUrl, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body);
					bookObj.Title = $(".main .dt-book h1.item-name").text();
					bookObj.SubTitle = $(".main .dt-book h2.item-name").text();
					bookObj.ImageUrl = $(".main .dt-book .img-box img").attr("src");
					var infos = ent.decode($(".main .intro-wrap section .cont").html()).trim().split("<br>");
					for(var i = 0; i < infos.length; i++) {
						var text = infos[i].split("：");
						if (text.length != 2) continue;
							var title = text[0].replace(/\s/g,""),
								content = text[1].trim().replace(/\s+/g," ");

						switch(title) {
							case "作者":
								bookObj.Author = content;
								break;
							case "ISBN":
								bookObj.ISBN = content;
								break;
							case "出版社":
								bookObj.Publisher = content;
								break;
							case "叢書系列":
								bookObj.Series = content;
								break;
							case "語言":
								bookObj.Language = content;
								break;
							case "規格":
								bookObj.Spec = content;
								break;
							case "出版日期":
								bookObj.PublishDate = content;
								break;
						}
					}
					console.log(bookObj);
				} else {
					console.log("We’ve encountered an error: " + error);
				}
			});
		} else {
			console.log("We’ve encountered an error: " + error);
		}
	});
}

function getFromEslite(pISBN) {
	var domain = "http://www.eslite.com/";
	var searchUrl = "Search_BW.aspx?query=";
	var bookObj = {};

	request({url:domain + searchUrl + pISBN, tunnel: true}, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $("#search_content td.name h3 a").eq(0);
			var targetUrl = $(link).attr("href");

			request(domain + targetUrl, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body);
					bookObj.Title = $("#content h1 span").eq(0).text().trim();
					bookObj.SubTitle = $("#content h1 span").eq(1).text().trim();
					bookObj.ImageUrl = $("#mainlink img").attr("src");
					var infos = $("#content h3");
					infos.each(function(i, info) {
						var text = $(info).text();
						if (text.indexOf("作者") != -1) {
							bookObj.Author = $("a", info).eq(0).text().trim();
						} else if (text.indexOf("譯者") != -1) {
							bookObj.Translater = $("a", info).eq(0).text().trim();
						} else if (text.indexOf("出版社") != -1) {
							bookObj.Publisher = $("a", info).eq(0).text().trim();
						} else if (text.indexOf("出版日期") != -1) {
							bookObj.PublishDate = text.split("／")[1].trim();
						} else if (text.indexOf("商品語言") != -1) {
							bookObj.Language = text.split("／")[1].trim();
						} else if (text.indexOf("裝訂") != -1) {
							bookObj.Spec = text.split("／")[1].trim();
						}
					});
					infos = $("#content .C_box p").text().split("\n");
					for(var i = 0; i < infos.length; i++) {
						if (infos[i].indexOf("ISBN 13") > -1) {
							bookObj.ISBN = infos[i].split("／")[1].trim();
						}
					}
					infos = $("#content .C_box table[id*='dlSpec'] td");
					infos.each(function(i, info) {
						var text = $("span",info).eq(0).text();
						if (text.indexOf("頁數") != -1) {
							bookObj.Pages = $("span",info).eq(1).text();
						}
					});

					console.log(bookObj);
				} else {
					console.log("We’ve encountered an error: " + error);
				}
			});
		} else {
			console.log("We’ve encountered an error: " + error);
		}
	});
}

pISBN = process.argv[2] || pISBN;

getFromKingstone(pISBN);
getFromBooks(pISBN);
getFromEslite(pISBN);
