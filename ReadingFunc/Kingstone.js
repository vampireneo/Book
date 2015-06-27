var Q = require("q"),
  cheerio = require("cheerio"),
  request = require("request"),
  moment = require('moment'),
  ent = require('ent');

exports.getByISBN = function(pISBN) {
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
						$ = cheerio.load(body);
						bookObj.source = [domain + targetUrl];
						bookObj.Title = [$("#team .media-heading").eq(0).text().trim()];
						bookObj.ImageUrl = [$("#team .pull-left .img-thumbnail").attr("src")];
						bookObj.Author = [$("#team .m_author").eq(0).text().trim()];
						bookObj.Publisher = [$("#team .m_author").eq(1).text().trim()];
						var infos = ent.decode($("#collapseTwo p").html()).trim().split("<br>");
						for(var i = 0; i < infos.length; i++) {
							var text = infos[i].split("：");
							if (text.length !== 2) continue;
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
						deferred.resolve(bookObj);
					} else {
						deferred.resolve(bookObj);
					}
				});
			}
			else {
				deferred.resolve(bookObj);
			}
		} else {
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
};
