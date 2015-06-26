var Q = require("q"),
  cheerio = require("cheerio"),
  request = require("request"),
  moment = require('moment'),
  ent = require('ent');

exports.getByISBN = function(pISBN) {
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
							if (text.indexOf("作者") !== -1) {
								bookObj.Author = [$("a", info).eq(0).text().trim()];
							} else if (text.indexOf("譯者") !== -1) {
								bookObj.Translater = [$("a", info).eq(0).text().trim()];
							} else if (text.indexOf("出版社") !== -1) {
								bookObj.Publisher = [$("a", info).eq(0).text().trim()];
							} else if (text.indexOf("出版日期") !== -1) {
								bookObj.PublishDate = [moment(text.split("／")[1].trim(),"YYYY/MM/DD").toDate()];
							} else if (text.indexOf("商品語言") !== -1) {
								bookObj.Language = [text.split("／")[1].trim().replace("中文/繁體", "繁體中文")];
							} else if (text.indexOf("裝訂") !== -1) {
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
							if (text.indexOf("頁數") !== -1) {
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
			else {
				deferred.resolve(bookObj);
			}
		} else {
			//console.log("We’ve encountered an error: " + error);
			//deferred.reject(error);
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
};
