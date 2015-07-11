var express = require('express'),
	Q = require("q"),
	MongoClient = require('mongodb').MongoClient,
	merge = require('./merge.js');

var kingstone = require('./ReadingFunc/Kingstone.js'),
	books = require('./ReadingFunc/Books.js'),
	eslite = require('./ReadingFunc/Eslite.js'),
	jointPublishing = require('./ReadingFunc/JointPublishing.js'),
	commercialPress = require('./ReadingFunc/CommercialPress.js');

var pISBN = "9789571358512";

var connectionStr = process.env.BOOKDB || "mongodb://localhost:27017/books";

var findBook = function(isbn, db, callback) {
  // Get the documents collection
  var collection = db.collection('books');
  // Find some documents
  collection.findOne({_id: isbn}, function(err, docs) {
    //assert.equal(err, null);
    //assert.equal(2, docs.length);
    //console.log("Found the following records");
    //console.dir(docs);
    callback(docs);
  });
};

var insertDocuments = function(bookObj, db, callback) {
  // Get the documents collection
  var collection = db.collection('books');
  // Insert some documents
  collection.insert({_id : bookObj.ISBN, searchData: bookObj}, function(err, result) {
    //assert.equal(err, null);
    //assert.equal(3, result.result.n);
    //assert.equal(3, result.ops.length);
    //console.log("Inserted 3 documents into the document collection");
    callback(result);
  });
};

var createServer = function(portNo) {
	var app = express();

	app.get('/isbn/:id([0-9]+)', function(req, res){
		var isbn = req.params.id;

		console.log("Get book info with isbn " + isbn);

		var book = {};
		MongoClient.connect(connectionStr, function(err, db) {
		  console.log("Connected correctly to server for findBook");
			findBook(isbn, db, function(docs) {
				//console.log(docs);
				if (docs && docs._id && docs._id !== "") {
					book = docs;
					res.json(book);
					db.close();
				}
				else {
					Q.all([kingstone.getByISBN(isbn), books.getByISBN(isbn), eslite.getByISBN(isbn), jointPublishing.getByISBN(isbn), commercialPress.getByISBN(isbn)])
					.spread(function() {
						var args = [].slice.call(arguments);
						book = args.reduce(function(a,b) {
							return merge(a,b);
						});
						insertDocuments(book, db, function(result) {
							//console.log(result);
							book = result.ops[0];
							console.log('new record inserted');
							db.close();
							res.json(book);
						});
					})
					.done();
				}
			});
		});
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
