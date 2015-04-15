var request = require("request"),
	cheerio = require("cheerio"),
	domain = "http://www.kingstone.com.tw",
	searchUrl = "/search/result.asp?q_type=isbn&c_name1=",
	pISBN = "9789571358512";
	pISBN = process.argv[2] || pISBN;
	
request(domain + searchUrl + pISBN, function (error, response, body) {
	if (!error) {
		var $ = cheerio.load(body);
		var link = $("#mainContent ul a.anchor").eq(0);
		var targetUrl = $(link).attr("href");
			
		console.log("Target URL is: " + targetUrl);
		request(domain + targetUrl, function (error, response, body) {
			if (!error) {
				var $ = cheerio.load(body);
				var title = $("head meta[property='og:title']").attr("content").replace("-金石堂網路書店", "");
				var imageUrl = $("head meta[property='og:image']").attr("content");
				var aurthor, isbn, publisher, publishDate, translater;
				var infos = $(".item_info li");
				infos.each(function(i, info) {
					var text = $("span", info).text();
					if (text.indexOf("作者：") != -1) {
						aurthor = $("em", info).text();
					} else if (text.indexOf("ISBN：") != -1) {
						isbn = $("em", info).text();
					} else if (text.indexOf("出版社：") != -1) {
						publisher = $("em", info).text();
					} else if (text.indexOf("譯者：") != -1) {
						translater = $("em", info).text();
					} else if (text.indexOf("出版日：") != -1) {
						publishDate = $("em", info).text();
					}
				});
				console.log("Title: " + title);
				console.log("ImageUrl: " + imageUrl);
				console.log("Aurthor: " + aurthor);
				console.log("ISBN: " + isbn);
				console.log("publisher: " + publisher);
				console.log("publishDate: " + publishDate);
			} else {
				console.log("We’ve encountered an error: " + error);
			}
		});
	} else {
		console.log("We’ve encountered an error: " + error);
	}
});