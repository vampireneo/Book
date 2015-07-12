var express = require('express'),
	Q = require("q"),
	MongoClient = require('mongodb').MongoClient,
	ISBNParser = require("./isbn.js"),
	merge = require('./merge.js');

var kingstone = require('./ReadingFunc/Kingstone.js'),
	books = require('./ReadingFunc/Books.js'),
	eslite = require('./ReadingFunc/Eslite.js'),
	jointPublishing = require('./ReadingFunc/JointPublishing.js'),
	commercialPress = require('./ReadingFunc/CommercialPress.js');

var defaultISBN = "9789571358512";

var connectionStr = process.env.BOOKDB || "mongodb://localhost:27017/books";

var findBook = function(pisbn, db, callback) {
  // Get the documents collection
  var collection = db.collection('books');
  // Find some documents
  collection.findOne({_id: pisbn}, function(err, docs) {
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

var deleteDocuments = function(pisbn, db, callback) {
  var collection = db.collection('books');
  collection.remove({_id : pisbn}, function(err, result) {
    callback(result);
  });
};

var createServer = function(portNo) {
	var app = express();

	app.delete('/api/isbn/:id([0-9]+)', function (req, res) {
		var pisbn = ISBNParser.parse(req.params.id);
		if (pisbn === null) {
			res.status(400).send('Incorrect ISBN.');
			return;
		}
		MongoClient.connect(connectionStr, function(err, db) {
			deleteDocuments(pisbn.asIsbn13(), db, function() {
				res.json('Book deleted.');
				db.close();
			});
		});
	});

	app.get('/api/isbn/:id([0-9]+)', function(req, res){
		var pisbn = ISBNParser.parse(req.params.id);
		if (pisbn === null) {
			res.status(400).send('Incorrect ISBN.');
			return;
		}

		console.log("Get book info with isbn " + pisbn.asIsbn13());
		var book = {};
		MongoClient.connect(connectionStr, function(err, db) {
		  console.log("Connected correctly to server for findBook");
			findBook(pisbn.asIsbn13(), db, function(docs) {
				if (docs && docs._id && docs._id !== "") {
					book = docs;
					res.json(book);
					db.close();
				}
				else {
					Q.all([kingstone.getByISBN(pisbn.asIsbn13()), books.getByISBN(pisbn.asIsbn13()), eslite.getByISBN(pisbn.asIsbn13()), jointPublishing.getByISBN(pisbn.asIsbn13()), commercialPress.getByISBN(pisbn.asIsbn13())])
					.spread(function() {
						var args = [].slice.call(arguments);
						book = args.reduce(function(a,b) {
							return merge(a,b);
						});
						if (book.ISBN && !Array.isArray(book.ISBN)) {
							insertDocuments(book, db, function(result) {
								book = result.ops[0];
								console.log('new record inserted');
								db.close();
								res.json(book);
							});
						} else {
							res.json(book);
						}
					})
					.done();
				}
			});
		});
	});

	app.get('/api/isbn/', function(req, res){
	  res.redirect('/api/isbn/' + defaultISBN);
	});

	app.get('/', function (req, res) {
	  res.redirect('/api/isbn/' + defaultISBN);
	});

	var server = app.listen(portNo, function () {

	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Listening at http://%s:%s', host, port);
	});

	return server;
};

module.exports = createServer;
