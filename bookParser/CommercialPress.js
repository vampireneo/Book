var Q = require("q"),
  cheerio = require("cheerio"),
  request = require("request"),
  moment = require('moment');

exports.getByISBN = function(pISBN) {
  var searchUrl = "http://www.cp1897.com.hk/product_info.php?BookId=";
	var bookObj = {};
	var deferred = Q.defer();

	request(searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			bookObj.source = searchUrl + pISBN;
			bookObj.Title = $("#mainPanel #rightPanel #productInfo_table td.productName").text().replace(/[《》]/gi,"");
			if (bookObj.Title.indexOf("對不起！") === -1) {
				var infos = $("#mainPanel #rightPanel #productInfo_table tr");
				infos.each(function(i, info) {
					var text = $("td.productLabel", info).text();
					var value = $("td.productDesc", info).text().trim();
					if (text.indexOf("作者") !== -1) {
						bookObj.Author = value;
					} else if (text.indexOf("譯者") !== -1) {
						bookObj.Translater = value;
					} else if (text.indexOf("出版社") !== -1) {
						bookObj.Publisher = value;
					} else if (text.indexOf("ISBN") !== -1) {
						bookObj.ISBN = value;
					}
				});

				infos = $("#mainPanel #rightPanel #extraInfo_table tr");
				infos.each(function(i, info) {
					var text = $("td.productLabel", info).text();
					var value = $("td.productDesc", info).text().trim();
					if (text.indexOf("出版日期") !== -1) {
            bookObj.PublishDate = moment(value,"YYYY年MM月").toDate();
					} else if (text.indexOf("語言版本") !== -1) {
						bookObj.Language = value.replace("中文(繁)", "繁體中文");
					} else if (text.indexOf("頁數") !== -1) {
						bookObj.Pages = value.replace(/頁/g,"").trim();
					} else if (text.indexOf("裝幀") !== -1) {
						bookObj.Spec = value;
					} else if (text.indexOf("叢書/系列") !== -1) {
						bookObj.Series = value;
					}
				});
			}
			else {
				bookObj = {};
			}
			deferred.resolve(bookObj);
		} else {
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
};
