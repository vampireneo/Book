var assert = require("assert"); // node.js core module
var Q = require("q");
var superagent = require('superagent');
var status = require('http-status');

var merge = require("../merge.js");
var server = require("../main.js");

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
	it('[1] + [2,3] should retrun [1,2,3]', function() {
		assert.deepEqual([1,2,3],merge([1], [2,3]));
	});
	it('[1] + [1,2] should retrun [1,2]', function() {
		assert.deepEqual([1,2],merge([1], [1,2]));
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
	it('[1] + [2,3,{a:1}] should retrun [1,2,3,{a:1}]', function() {
		assert.deepEqual([1,2,3,{a:1}],merge([1], [2,3,{a:1}]));
	});
});

describe('Server', function(){
	var readingFuncTimeOut = process.env.TEST_TIMEOUT||10000;
	this.timeout(readingFuncTimeOut);

	describe('Test the server object', function() {
		var app;

		before(function() {
			app = server(3000);
		});

		after(function() {
			app.close();
  	});

		it('returns result should have a correct ISBN', function(done) {
			superagent.get('http://localhost:3000/isbn/9789571358512').end(function(err, res) {
				assert.ifError(err);
				assert.equal(res.status, status.OK);
				var result = JSON.parse(res.text);
				//assert.deepEqual({ user: 'test' }, result);
				assert.equal("9789571358512", result.ISBN[0]);
				done();
			});
		});

	it('returns default ISBN should be 9789571358512', function(done) {
		superagent.get('http://localhost:3000/').end(function(err, res) {
			assert.ifError(err);
			assert.equal(res.status, status.OK);
			var result = JSON.parse(res.text);
			//assert.deepEqual({ user: 'test' }, result);
			assert.equal("9789571358512", result.ISBN[0]);
			done();
		});
	});

	});
});
