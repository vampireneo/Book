var express = require('express'),
	bodyParser = require('body-parser'),
	Q = require("q"),
	MongoClient = require('mongodb').MongoClient,
	ISBNParser = require("./utility/isbn.js"),
	merge = require('./utility/merge.js'),
	passport = require('passport'),
	localStrategy = require('passport-local').Strategy;

var kingstone = require('./bookParser/Kingstone.js'),
	books = require('./bookParser/Books.js'),
	eslite = require('./bookParser/Eslite.js'),
	jointPublishing = require('./bookParser/JointPublishing.js'),
	hkBookCity = require('./bookParser/HkBookCity.js'),
	commercialPress = require('./bookParser/CommercialPress.js');

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
	app.locals.pretty = true;
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(bodyParser.json());

	passport.use(new LocalStrategy(
		function(username, password, done) {
			User.findOne({ username: username }, function(err, user) {
				if (err) { return done(err); }
				if (!user) {
					return done(null, false, { message: 'Incorrect username.' });
				}
				if (!user.validPassword(password)) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, user);
			});
		}
	));

	app.post('/login', passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.post('/api/isbn/:id([0-9]+)', function (req, res) {
		var pisbn = ISBNParser.parse(req.params.id);
		console.log(req.body);
		res.status(200).send();
	});

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
					Q.all([kingstone.getByISBN(pisbn.asIsbn13()), books.getByISBN(pisbn.asIsbn13()), eslite.getByISBN(pisbn.asIsbn13()), jointPublishing.getByISBN(pisbn.asIsbn13()), commercialPress.getByISBN(pisbn.asIsbn13()), hkBookCity.getByISBN(pisbn.asIsbn13())])
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

	app.get('/api/', function (req, res) {
	  res.redirect('/api/isbn/' + defaultISBN);
	});

	app.get('/search', function (req, res) {
	  //res.redirect('/index.htm');
		res.render('search', { pageTitle: "Search" });
	});

	app.get('/', function (req, res) {
	  //res.redirect('/index.htm');
		res.render('index', { pageTitle: "Home" });
	});

	var server = app.listen(portNo, function () {

	  var host = server.address().address;
	  var port = server.address().port;

	  console.log('Listening at http://%s:%s', host, port);
	});

	return server;
};

module.exports = createServer;
