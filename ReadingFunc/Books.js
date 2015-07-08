var Q = require("q"),
  cheerio = require("cheerio"),
  request = require("request"),
  moment = require('moment'),
  ent = require('ent');

exports.getByISBN = function(pISBN) {
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
				request(targetUrl, function (error, response, body) {
					if (!error) {
						$ = cheerio.load(body);
						bookObj.source = [targetUrl];
						bookObj.Title = [$(".main .dt-book h1.item-name").text().trim()];
						bookObj.SubTitle = [$(".main .dt-book h2.item-name").text().trim()];
						bookObj.ImageUrl = [$(".main .dt-book .img-box img").attr("src").replace(/http:\/\/im2.book.com.tw\/image\/getImage\?i=/,'').replace(/&v=.*/,'')];
						var infos = ent.decode($(".main .intro-wrap section .cont").html()).trim().split("<br>");
						for(var i = 0; i < infos.length; i++) {
							var text = infos[i].split("：");
							if (text.length !== 2) {
								continue;
							}
							var title = text[0].replace(/\s/g,"").trim(),
									content = text[1].trim().replace(/\s+/g," ").trim().replace(/‧/g,"．");

							switch(title) {
								case "作者":
									bookObj.Author = [content];
									break;
								case "ISBN":
									bookObj.ISBN = content;
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
