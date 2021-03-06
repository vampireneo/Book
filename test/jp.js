//var assert = require("assert"); // node.js core module
var Q = require('q');

var jointPublishing = require('../bookParser/JointPublishing.js');

var readingFuncTimeOut = process.env.TEST_TIMEOUT || 10000;
var showData = process.env.SHOW_DATA || false;

describe('bookParser', function() {
  this.timeout(readingFuncTimeOut);
  describe('Joint Publishing', function() {
    describe('getByISBN()', function() {
      it('should fail to get the data of the book "以小勝大"', function(done) {
        Q.all(jointPublishing.getByISBN('9789571358512')).then(function(value) {
          if (showData) {
            console.log(value);
          }
          if (value.hasOwnProperty('Title')) {
            return done('Data should not be found!');
          }
          done();
        });
      });
      it('should get the correct data of the book "武道狂之詩（卷十四）"', function(
        done
      ) {
        Q.all(jointPublishing.getByISBN('9789881278517')).then(function(value) {
          if (showData) {
            console.log(value);
          }
          if (value.ISBN !== '9789881278517') {
            return done('ISBN does not match.');
          }
          if (!value.hasOwnProperty('Title')) {
            return done('Data should have title!');
          }
          if (value.Title === '') {
            return done('Title is empty.');
          }
          if (value.Title !== '武道狂之詩（卷十四）──山．火．海') {
            return done('Title does not match.');
          }
          if (value.hasOwnProperty('ImageUrl')) {
            return done('Data should have no book cover image.');
          }
          if (value.Author !== '喬靖夫') {
            return done('Author does not match.');
          }
          done();
        });
      });
      it('should get the correct data of the book "挑戰你的神邏輯！"', function(done) {
        Q.all(jointPublishing.getByISBN('9789869165174')).then(function(value) {
          if (showData) {
            console.log(value);
          }
          if (value.ISBN !== '9789869165174') {
            return done('ISBN does not match.');
          }
          if (!value.hasOwnProperty('Title')) {
            return done('Data should have title!');
          }
          if (value.Title === '') {
            return done('Title is empty.');
          }
          if (value.Title !== '挑戰你的神邏輯！') {
            return done('Title does not match.');
          }
          if (!value.hasOwnProperty('Series')) {
            return done('Data should have series!');
          }
          done();
        });
      });
      it('should get the correct data of the book "世界頂級狙擊手"', function(done) {
        Q.all(jointPublishing.getByISBN('9787538741643')).then(function(value) {
          if (showData) {
            console.log(value);
          }
          if (value.ISBN !== '9787538741643') {
            return done('ISBN does not match.');
          }
          if (!value.hasOwnProperty('Title')) {
            return done('Data should have title!');
          }
          if (value.Title === '') {
            return done('Title is empty.');
          }
          if (value.Title !== '世界頂級狙擊手') {
            return done('Title does not match.');
          }
          if (!value.hasOwnProperty('Translater')) {
            return done('Data should have translater!');
          }
          if (!value.hasOwnProperty('Pages')) {
            return done('Data should have pages!');
          }
          done();
        });
      });
    });
  });
});