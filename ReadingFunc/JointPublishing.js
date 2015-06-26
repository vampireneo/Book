var Q = require("q"),
  cheerio = require("cheerio"),
  request = require("request"),
  moment = require('moment'),
  ent = require('ent');

exports.getByISBN = function(pISBN) {
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
							if (text.indexOf("叢書") !== -1) {
								bookObj.Series = [content];
							} else if (text.indexOf("作者") !== -1) {
								bookObj.Author = [content];
							} else if (text.indexOf("譯者") !== -1) {
								bookObj.Translater = [content];
							} else if (text.indexOf("出版社") !== -1) {
								bookObj.Publisher = [content];
							} else if (text.indexOf("出版日期") !== -1) {
								bookObj.PublishDate = [moment(content,"YYYY/MM/DD").toDate()];
							} else if (text.indexOf("ISBN") !== -1) {
								bookObj.ISBN = [content];
							} else if (text.indexOf("語言") !== -1) {
								bookObj.Language = [content.replace("中文(繁)", "繁體中文")];
							} else if (text.indexOf("頁數") !== -1) {
								var page = content.replace(/頁/g,"").trim();
								if (page !== "0")
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
