var assert = require("assert"); // node.js core module
var Q = require("q");

var merge = require("../merge.js");
var main = require("../main.js");

var kingstone = require("../ReadingFunc/Kingstone.js");
var books = require("../ReadingFunc/Books.js");
var eslite = require('../ReadingFunc/Eslite.js');
var jointPublishing = require('../ReadingFunc/JointPublishing.js');
var commercialPress = require('../ReadingFunc/CommercialPress.js');


describe('Merge', function() {
	it('[] + [] should retrun []', function() {
		assert.deepEqual([],merge([], []));
	});
  it('{} + {} should retrun {}', function() {
		assert.deepEqual({},merge({}, {}));
	});
  it('[1] + [1] should retrun [1]', function() {
		assert.deepEqual([1],merge([1], [1]));
	});
  it('[1] + [2] should retrun [1,2]', function() {
		assert.deepEqual([1,2],merge([1], [2]));
	});
  it('[1,2] + [2,3] should retrun [1,2,3]', function() {
		assert.deepEqual([1,2,3],merge([1,2], [2,3]));
	});
  it('{a:1} + {a:2} should retrun {a:[1,2]}');
  /*
  it('{a:1} + {a:2} should retrun {a:[1,2]}', function() {
		assert.deepEqual({a:[1,2]},merge({a:1}, {a:2}));
	});
  */
  it('{a:[1]} + {a:[2]} should retrun {a:[1,2]}', function() {
		assert.deepEqual({a:[1,2]},merge({a:[1]}, {a:[2]}));
	});
  it('{a:[1]} + {b:[2]} should retrun {a:[1], b:[2]}', function() {
		assert.deepEqual({a:[1], b:[2]},merge({a:[1]}, {b:[2]}));
	});
  it('{a:1} + {b:2} should retrun {a:1, b:2}', function() {
		assert.deepEqual({a:1, b:2},merge({a:1}, {b:2}));
	});
  it('{a:[1]} + {b:[2], a:[2]} should retrun {a:[1,2], b:[2]}', function() {
		assert.deepEqual({a:[1,2], b:[2]},merge({a:[1]}, {b:[2], a:[2]}));
	});
  it('{a:[1], c: "a"} + {b:[2], a:[2]} should retrun {a:[1,2], b:[2], c: "a"}', function() {
		assert.deepEqual({a:[1,2], b:[2], c: "a"},merge({a:[1], c: "a"}, {b:[2], a:[2]}));
	});
});

describe('Main', function(){
	it('should test something here');
});

describe('ReadingFunc', function(){
	describe('Kingstone', function(){
		describe('getByISBN()', function(){
			it('should get the correct data of the book "以小勝大"', function(done){
				Q.all(kingstone.getByISBN("9789571358512"))
				.then(function(value) {
					//console.log(value);
					if (value.Title == []) return done("Title is empty.");
					if (value.Title[0] != '以小勝大：弱者如何找到優勢，反敗為勝？') return done("Title does not match.");
					if (value.ImageUrl[0] != 'http://cdn.kingstone.com.tw/book/images/product/20117/2011770967705/2011770967705b.jpg') return done("Book cover image does not match.");
					if (value.Author[0] != '麥爾坎．葛拉威爾') return done("Author does not match.");
					done();
				});
			});
		});
	});

	describe('Books', function(){
		describe('getByISBN()', function(){
			it('should get the correct data of the book "以小勝大"', function(done){
				Q.all(books.getByISBN("9789571358512"))
				.then(function(value) {
					if (value.Title == []) return done("Title is empty.");
	        if (value.Title[0] != '以小勝大：弱者如何找到優勢，反敗為勝？') return done("Title does not match.");
	        if (value.ImageUrl[0] != 'http://www.books.com.tw/img/001/062/01/0010620158.jpg') return done("Book cover image does not match.");
	        if (value.Author[0] != '麥爾坎．葛拉威爾') return done("Author does not match.");
					done();
				});
			});
		});
	});

	describe('Eslite', function(){
		describe('getByISBN()', function(){
			it('should get the correct data of the book "以小勝大"', function(done){
				Q.all(eslite.getByISBN("9789571358512"))
				.then(function(value) {
					if (value.Title == []) return done("Title is empty.");
					if (value.Title[0] != '以小勝大: 弱者如何找到優勢, 反敗為勝?') return done("Title does not match.");
					if (value.ImageUrl[0] != 'http://pic.eslite.com/Upload/Product/201312/m/635228661509612548.jpg') return done("Book cover image does not match.");
					if (value.Author[0] != '麥爾坎．葛拉威爾') return done("Author does not match.");
					done();
				});
			});
		});
	});

	describe('Joint Publishing', function(){
		describe('getByISBN()', function(){
			it('should fail to get the data of the book "以小勝大"', function(done){
				Q.all(jointPublishing.getByISBN("9789571358512"))
				.then(function(value) {
					if (value.hasOwnProperty("Title")) return done("Data should not be found!");
					done();
				});
			});
			it('should get the correct data of the book "武道狂之詩（卷十四）"', function(done){
				Q.all(jointPublishing.getByISBN("9789881278517"))
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
