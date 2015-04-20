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
				
			console.log("Target URL is: " + targetUrl);
			request(domain + targetUrl, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body);
					bookObj.Title = $("head meta[property='og:title']").attr("content").replace("-金石堂網路書店", "");
					bookObj.ImageUrl = $("head meta[property='og:image']").attr("content");
					var aurthor, isbn, publisher, publishDate, translater;
					var infos = $(".item_info li");
					infos.each(function(i, info) {
						var text = $("span", info).text();
						if (text.indexOf("作者：") != -1) {
							bookObj.Aurthor = $("em", info).text();
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
				
			console.log("Target URL is: " + targetUrl);
			request(domain + targetUrl, function (error, response, body) {
				if (!error) {
					var $ = cheerio.load(body);
					bookObj.Title = $("#team .media-heading").text();
					bookObj.ImageUrl = $("#team .pull-left .img-thumbnail").attr("src");
					bookObj.Aurthor = $("#team .m_author").eq(0).text().trim();
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

pISBN = process.argv[2] || pISBN;

getFromKingstone(pISBN);
