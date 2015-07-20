var Q = require("q"),
  cheerio = require("cheerio"),
  request = require("request"),
  iconv = require('iconv-lite'),
  moment = require('moment');

exports.getByISBN = function(pISBN) {
  var domain = "http://www.hkbookcity.com/";
	var searchUrl = "searchbook2.php?startnum=1&key=isbn&keyword=";
	var bookObj = {};
	var deferred = Q.defer();

	//console.log("get url: " + domain + searchUrl + pISBN);
	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $(".booktitle").eq(0).closest("a");
			var targetUrl = $(link).attr("href");

			if (link.length > 0) {
				request({url: domain + targetUrl, encoding: null}, function (error, response, body) {
					if (!error) {
            body = iconv.decode(new Buffer(body), "big5");
						$ = cheerio.load(body);
						bookObj.source = targetUrl;
						bookObj.Title = $("table img[src='image/bookname.gif']").siblings().find("font").text().trim();
						bookObj.ImageUrl = domain + $("table img[src*='image_book/']").eq(0).attr("src");
						var infos = $("table img[src*='image_book/']").eq(0).closest("tr").find("table tr");
						for(var i = 0; i < infos.length; i++) {
							var title = $(infos[i]).find("td").eq(0).text().trim(),
									content = $(infos[i]).find("td").eq(1).text().trim();

							switch(title) {
								case "作者:":
									bookObj.Author = content;
									break;
								case "ISBN-13:":
									bookObj.ISBN = content;
									break;
								case "出版社:":
									bookObj.Publisher = content;
									break;
								case "出版日期:":
									bookObj.PublishDate = moment(content,"YYYY/MM").toDate();
									break;
                case "頁數:":
									bookObj.Pages = content;
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
