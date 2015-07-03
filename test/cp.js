var assert = require("assert"); // node.js core module
var Q = require("q");

var merge = require("../merge.js");
var main = require("../main.js");

var kingstone = require("../ReadingFunc/Kingstone.js");
var books = require("../ReadingFunc/Books.js");
var eslite = require('../ReadingFunc/Eslite.js');
var jointPublishing = require('../ReadingFunc/JointPublishing.js');
var commercialPress = require('../ReadingFunc/CommercialPress.js');

var readingFuncTimeOut = process.env.TEST_TIMEOUT||10000;

describe('ReadingFunc', function(){
	this.timeout(readingFuncTimeOut);

	describe('Commercial Press', function(){
		describe('getByISBN()', function(){
			it('should fail to get the data of the book "以小勝大"', function(done){
				Q.all(commercialPress.getByISBN("9789571358512"))
				.then(function(value) {
					if (value.Title == []) return done("Title is empty.");
					if (value.Title[0] != '以小勝大──弱者如何找到優勢，反敗為勝？') return done("Title does not match.");
					if (value.hasOwnProperty("ImageUrl")) return done("Data should have no book cover image.");
					if (value.Author[0] != '麥爾坎．葛拉威爾') return done("Author does not match.");
					done();
				});
			});
			it('should get the correct data of the book "武道狂之詩（卷十四）"', function(done){
				Q.all(commercialPress.getByISBN("9789881278517"))
				.then(function(value) {
					if (!value.hasOwnProperty("Title")) return done("Data should have title!");
					if (value.Title == []) return done("Title is empty.");
					if (value.Title[0] != '武道狂之詩（卷十四）──山．火．海') return done("Title does not match.");
					if (value.hasOwnProperty("ImageUrl")) return done("Data should have no book cover image.");
					if (value.Author[0] != '喬靖夫') return done("Author does not match.");
					done();
				});
			});
		});
	});
});
