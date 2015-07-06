var express = require('express'),
	Q = require("q"),
	merge = require('./merge.js');

var kingstone = require('./ReadingFunc/Kingstone.js'),
	books = require('./ReadingFunc/Books.js'),
	eslite = require('./ReadingFunc/Eslite.js'),
	jointPublishing = require('./ReadingFunc/JointPublishing.js'),
	commercialPress = require('./ReadingFunc/CommercialPress.js');

var pISBN = "9789571358512";

/*
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
*/

var createServer = function(portNo) {
	var app = express();

	app.get('/isbn/:id([0-9]+)', function(req, res){
		var isbn = req.params.id;

		console.log("Get book info with isbn " + isbn);

		Q.all([kingstone.getByISBN(isbn), books.getByISBN(isbn), eslite.getByISBN(isbn), jointPublishing.getByISBN(isbn), commercialPress.getByISBN(isbn)])
		.spread(function() {
			var args = [].slice.call(arguments);
			var result = args.reduce(function(a,b) {
				return merge(a,b);
			});
			res.json(result);
		})
		.done();
	});

	app.get('/isbn/', function(req, res){
	  res.redirect('/isbn/' + pISBN);
	});

	app.get('/', function (req, res) {
	  res.redirect('/isbn/' + pISBN);
	});

	var server = app.listen(portNo, function () {

	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Listening at http://%s:%s', host, port);
	});

	return server;
};

module.exports = createServer;
