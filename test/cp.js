var assert = require("assert"); // node.js core module
var Q = require("q");

var commercialPress = require('../bookParser/CommercialPress.js');

var readingFuncTimeOut = process.env.TEST_TIMEOUT||10000;
var showData = process.env.SHOW_DATA||false;

describe('bookParser', function(){
	this.timeout(readingFuncTimeOut);

	describe('Commercial Press', function(){
		describe('getByISBN()', function(){
			it('should fail to get the data of the book "以小勝大"', function(done){
				Q.all(commercialPress.getByISBN("9789571358512"))
				.then(function(value) {
					if (showData) console.log(value);
					if (value.ISBN !== "9789571358512") return done("ISBN does not match.");
					if (value.Title === "") return done("Title is empty.");
					if (value.Title !== '以小勝大──弱者如何找到優勢，反敗為勝？') return done("Title does not match.");
					if (value.hasOwnProperty("ImageUrl")) return done("Data should have no book cover image.");
					if (value.Author !== '麥爾坎．葛拉威爾') return done("Author does not match.");
					done();
				});
			});
			it('should get the correct data of the book "武道狂之詩（卷十四）"', function(done){
				Q.all(commercialPress.getByISBN("9789881278517"))
				.then(function(value) {
					if (showData) console.log(value);
					if (value.ISBN !== "9789881278517") return done("ISBN does not match.");
					if (!value.hasOwnProperty("Title")) return done("Data should have title!");
					if (value.Title === "") return done("Title is empty.");
					if (value.Title !== '武道狂之詩（卷十四）──山．火．海') return done("Title does not match.");
					if (value.hasOwnProperty("ImageUrl")) return done("Data should have no book cover image.");
					if (value.Author !== '喬靖夫') return done("Author does not match.");
					done();
				});
			});
		});
	});
});
