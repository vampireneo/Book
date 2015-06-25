var assert = require("assert"); // node.js core module
var merge = require("../merge.js");
var main = require("../main.js");
var Q = require("q");

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
  describe('getFromKingstone(pISBN)', function(){
    it('should get the correct data of the book "以小勝大"', function(done){
      Q.all(main.getFromKingstone("9789571358512"))
      .then(function(value) {
        if (value.Title == []) return done("Title is empty.");
        if (value.Title[0] != '以小勝大：弱者如何找到優勢，反敗為勝？大開眼界：葛拉威爾的奇想搜尋你內心的關鍵字：Google最熱門的自我成長課程！幫助你創造健康、快樂、成功的人生，在工作、生活上脫胎換骨！') return done("Title does not match.");
        if (value.ImageUrl[0] != 'http://cdn.kingstone.com.tw/book/images/product/20117/2011770967705/2011770967705b.jpg') return done("Book cover image does not match.");
        if (value.Author[0] != '麥爾坎．葛拉威爾') return done("Author does not match.");
        done();
      });
    })
  })
  describe('getFromBooks(pISBN)', function(){
    it('should get the correct data of the book "以小勝大"', function(done){
      Q.all(main.getFromBooks("9789571358512"))
      .then(function(value) {
        if (value.Title == []) return done("Title is empty.");
        if (value.Title[0] != '以小勝大：弱者如何找到優勢，反敗為勝？') return done("Title does not match.");
        if (value.ImageUrl[0] != 'http://www.books.com.tw/img/001/062/01/0010620158.jpg') return done("Book cover image does not match.");
        if (value.Author[0] != '麥爾坎．葛拉威爾') return done("Author does not match.");
        done();
      });
    })
  })
})
