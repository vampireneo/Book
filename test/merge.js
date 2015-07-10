var assert = require("assert"); // node.js core module
var merge = require("../merge.js");

var readingFuncTimeOut = process.env.TEST_TIMEOUT||10000;
var showData = process.env.SHOW_DATA||false;

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
	it('[1] + [2,3] should retrun [1,2,3]', function() {
		assert.deepEqual([1,2,3],merge([1], [2,3]));
	});
	it('[1] + [1,2] should retrun [1,2]', function() {
		assert.deepEqual([1,2],merge([1], [1,2]));
	});
  it('[1,2] + [2,3] should retrun [1,2,3]', function() {
		assert.deepEqual([1,2,3],merge([1,2], [2,3]));
	});
  it('{a:1} + {a:2} should retrun {a:[1,2]}', function() {
		assert.deepEqual({a:[1,2]},merge({a:1}, {a:2}));
	});
	it('{a:1} + {a:1} should retrun {a:1}', function() {
		assert.deepEqual({a:1},merge({a:1}, {a:1}));
	});
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
	it('[1] + [2,3,{a:1}] should retrun [1,2,3,{a:1}]', function() {
		assert.deepEqual([1,2,3,{a:1}],merge([1], [2,3,{a:1}]));
	});
	it('[1,2,4] + [2,3,{a:1}] should retrun [1,2,3,{a:1}]', function() {
		assert.deepEqual([1,2,{a:1},3],merge([1,2,4], [2,3,{a:1}]));
	});
	it('{title: "abc"} + {title: "def"} should retrun {title: ["abc", "def"]}', function() {
		assert.deepEqual({title: ["abc", "def"]},merge({title: "abc"}, {title: "def"}));
	});
	it('{title: "abc"} + {title: "def"} + {title: "xyz"} should retrun {title: ["abc", "def", "xyz"]}', function() {
		assert.deepEqual({title: ["abc", "def", "xyz"]},merge(merge({title: "abc"}, {title: "def"}),{title: "xyz"}) );
	});
	it('{title: "abc", Author:["Peter", "Paul"]} + {title: "def", Author:["Mary", "May"]} should retrun {title: ["abc", "def"], Author:["Peter", "Paul", "Mary", "May"]}', function() {
		assert.deepEqual({title: ["abc", "def"], Author:["Peter", "Paul", "Mary", "May"]},merge({title: "abc", Author:["Peter", "Paul"]}, {title: "def", Author:["Mary", "May"]}));
	});
	it('new Date(2013, 3, 4) + new Date(2013, 3, 4) should retrun new Date(2013, 3, 4)', function() {
		var d = new Date(2013,3,4);
		assert.deepEqual(d,merge(d, d));
	});
	it('new Date(2013, 5, 4) + new Date(2013, 3, 4) should retrun [Apr 04 2013, Jun 04 2013]', function() {
		var d1 = new Date(2013,3,4);
		var d2 = new Date(2013,5,4);
		assert.deepEqual([d1, d2],merge(d1, d2));
	});
	it('d1 + d2 + d3 should retrun [d1, d2, d3]', function() {
		var d1 = new Date(2013,3,4);
		var d2 = new Date(2013,5,4);
		var d3 = new Date(2013,7,4);
		assert.deepEqual([d1, d2, d3],merge(merge(d1, d2), d3));
	});
});
