var express = require('express'),
	request = require("request"),
	cheerio = require("cheerio"),
	moment = require('moment'),
	Q = require("q"),
	ent = require('ent'),
	merge = require('./merge.js'),
	pISBN = "9789571358512",
	app = express(),
	kingstone = require('./ReadingFunc/Kingstone.js'),
	books = require('./ReadingFunc/Books.js'),
	eslite = require('./ReadingFunc/Eslite.js'),
	jointPublishing = require('./ReadingFunc/JointPublishing.js'),
	commercialPress = require('./ReadingFunc/CommercialPress.js');

// just an idea
function getFromBookStore(domain, searchUrl, pISBN, readFunc) {
	var bookObj = {};
	var deferred = Q.defer();

	request(domain + searchUrl + pISBN, function (error, response, body) {
		if (!error) {
			var $ = cheerio.load(body);
			readFunc(domain, $, bookObj, deferred);
		} else {
			deferred.resolve(bookObj);
		}
	});
	return deferred.promise;
}

exports.start = function(portNo) {
	app.get('/isbn/:id([0-9]+)', function(req, res){
		var isbn = req.params.id;

		console.log("Get book info with isbn " + isbn);

		Q.all([kingstone.getByISBN(isbn), books.getByISBN(isbn), eslite.getByISBN(isbn), jointPublishing.getByISBN(isbn), commercialPress.getByISBN(isbn)])
		.spread(function(x, y, z, a, b) {
			var result = merge(x, merge(y, merge(z, merge(a, b))));
			res.json(result);
		})
		.done();
	});

	app.get('/isbn/', function(req, res){
	  res.redirect('/isbn/' + pISBN);
	});

	app.get('/', function (req, res) {
	  //res.send('Hello World!');
	  res.redirect('/isbn/' + pISBN);
	});

	var server = app.listen(portNo, function () {

	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Listening at http://%s:%s', host, port);

	});
};
