//var assert = require("assert"); // node.js core module
var Q = require("q");

var eslite = require('../bookParser/HkBookCity.js');

var readingFuncTimeOut = process.env.TEST_TIMEOUT||10000;
var showData = process.env.SHOW_DATA||false;

describe('bookParser', function(){
	this.timeout(readingFuncTimeOut);

	describe('HkBookCity', function(){
		describe('getByISBN()', function(){
			it('should get the correct data of the book "武道狂之詩（卷十四）──山．火．海"', function(done){
				Q.all(eslite.getByISBN("9789881278517"))
				.then(function(value) {
					if (showData) {console.log(value);}
					if (value.ISBN !== "9789881278517") {return done("ISBN does not match.");}
					if (value.Title === "") {return done("Title is empty.");}
					if (value.Title !== '武道狂之詩（卷十四）──山．火．海') {return done("Title does not match.");}
					if (value.ImageUrl !== 'http://www.hkbookcity.com/image_book/9789881278517.jpg') {return done("Book cover image does not match.");}
					if (!value.hasOwnProperty("Author")) {return done("Cannot find Author.");}
					if (value.Author !== '喬靖夫') {return done("Author does not match - 喬靖夫 != " + value.Author[0]);}
					done();
				});
			});
		});
	});
});
