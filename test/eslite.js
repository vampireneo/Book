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

	describe('Eslite', function(){
		describe('getByISBN()', function(){
			it('should get the correct data of the book "以小勝大"', function(done){
				Q.all(eslite.getByISBN("9789571358512"))
				.then(function(value) {
					if (value.Title == []) return done("Title is empty.");
					if (value.Title[0] != '以小勝大: 弱者如何找到優勢, 反敗為勝?') return done("Title does not match.");
					if (value.ImageUrl[0] != 'http://pic.eslite.com/Upload/Product/201312/m/635228661509612548.jpg') return done("Book cover image does not match.");
					if (!value.hasOwnProperty("Author")) return done("Cannot find Author.");
					if (value.Author[0] != '麥爾坎．葛拉威爾') return done("Author does not match - 麥爾坎．葛拉威爾 != " + value.Author[0]);
					done();
				});
			});
		});
	});
});
