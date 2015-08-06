var Q = require("q"),
	cheerio = require("cheerio"),
	request = require("request"),
	moment = require('moment'),
	ent = require('ent');

exports.getByISBN = function(pISBN) {
	var domain = "http://search.books.com.tw";
	var searchUrl = "/exep/prod_search.php?cat=BKA&key=";
	var bookObj = {};
	var deferred = Q.defer();

	//console.log("get url: " + domain + searchUrl + pISBN);
	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			var link = $(".result .item h3 a").eq(0);
			var targetUrl = $(link).attr("href");

			if (link.length > 0) {
				request(targetUrl, function (error, response, body) {
					if (!error) {
						$ = cheerio.load(body);
						bookObj.source = targetUrl;
						bookObj.Title = $(".main_wrap h1[itemprop='name']").text().trim();
						bookObj.SubTitle = $(".main_wrap h2").text().trim();
						bookObj.ImageUrl = $(".main_wrap .cover_img img[itemprop='image']").attr("src").replace(/http:\/\/.*\.book\.com\.tw\/image\/getImage\?i=/,'').replace(/&v=.*/,'');
						bookObj.Author = $(".main_wrap li[itemprop='author'] a[href*='search.books.com.tw']").text().trim().replace(/‧/g,"．");

						var infos = $(".main_wrap .type02_p003 li");
						for(var i = 0; i < infos.length; i++) {
							var text = infos.eq(i).text().split("：");
							if (text.length !== 2) {
								continue;
							}
							var title = text[0].replace(/\s/g,"").trim(),
									content = text[1].trim().replace(/\s+/g," ").trim().replace(/‧/g,"．");

							switch(title) {
								//原文作者
								//譯者
								case "出版社":
									bookObj.Publisher = content;
									break;
								case "出版日期":
									bookObj.PublishDate = moment(content,"YYYY/MM/DD").toDate();
									break;
								case "語言":
									bookObj.Language = content;
									break;
							}
						}
						infos = $(".main_wrap .bd li");
						for(var j = 0; j < infos.length; j++) {
							var text2 = infos.eq(j).text().split("：");
							if (text2.length !== 2) {
								continue;
							}
							var title2 = text2[0].replace(/\s/g,"").trim(),
									content2 = text2[1].trim().replace(/\s+/g," ").trim().replace(/‧/g,"．");

							switch(title2) {
								case "ISBN":
									bookObj.ISBN = content2;
									break;
								case "叢書系列":
									bookObj.Series = content2;
									break;
								case "規格":
									var contents = content2.split("/");
									bookObj.Spec = contents[0].trim();
									bookObj.Pages = contents[1].replace("頁","").trim();
									break;
							}
						}

						if (bookObj.ISBN && bookObj.ISBN !== pISBN) {
							bookObj = {};
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
