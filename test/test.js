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
