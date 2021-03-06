//var assert = require("assert"); // node.js core module
var Q = require('q');

var books = require('../bookParser/Books.js');

var readingFuncTimeOut = process.env.TEST_TIMEOUT || 10000;
var showData = process.env.SHOW_DATA || false;

describe('bookParser', function() {
  this.timeout(readingFuncTimeOut);

  describe('Books', function() {
    describe('getByISBN()', function() {
      it('should get the correct data of the book "以小勝大"', function(done) {
        Q.all(books.getByISBN('9789571358512')).then(function(value) {
          if (showData) {
            console.log(value);
          }
          if (value.ISBN !== '9789571358512') {
            return done('ISBN does not match.');
          }
          if (value.Title === '') {
            return done('Title is empty.');
          }
          if (value.Title !== '以小勝大：弱者如何找到優勢，反敗為勝？') {
            return done('Title does not match.');
          }
          if (
            value.ImageUrl !==
            'http://www.books.com.tw/img/001/062/01/0010620158.jpg'
          ) {
            return done('Book cover image does not match.');
          }
          if (value.Author !== '麥爾坎．葛拉威爾') {
            return done('Author does not match.');
          }
          done();
        });
      });
      it('should be unable to find the book with ISBN "9789881662286"', function(
        done
      ) {
        Q.all(books.getByISBN('9789881662286')).then(function(value) {
          if (showData) {
            console.log(value);
          }
          if (value.ISBN) {
            return done('Should not be able to find the book.');
          }
          done();
        });
      });
    });
  });
});