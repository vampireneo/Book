var assert = require("assert"); // node.js core module
var Q = require("q");
var superagent = require('superagent');
var status = require('http-status');

var server = require("../main.js");

var readingFuncTimeOut = process.env.TEST_TIMEOUT||10000;
var showData = process.env.SHOW_DATA||false;

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
				//console.log(result);
				if (showData) {
					console.log(result);
				}
				assert.equal("9789571358512", result._id);
				done();
			});
		});

		it('returns should returns result of 9789571358512 by default', function(done) {
			superagent.get('http://localhost:3000/').end(function(err, res) {
				assert.ifError(err);
				assert.equal(res.status, status.OK);
				var result = JSON.parse(res.text);
				//assert.deepEqual({ user: 'test' }, result);
				assert.equal("9789571358512", result._id);
				done();
			});
		});

		it('returns default ISBN should be 9789571358512', function(done) {
			superagent.get('http://localhost:3000/isbn/').end(function(err, res) {
				assert.ifError(err);
				assert.equal(res.status, status.OK);
				var result = JSON.parse(res.text);
				//assert.deepEqual({ user: 'test' }, result);
				assert.equal("9789571358512", result._id);
				done();
			});
		});

		it('returns 404 if incorrect url', function(done) {
			superagent.get('http://localhost:3000/isbbn/').end(function(err, res) {
				assert.equal(res.status, status.NOT_FOUND);
				done();
			});
		});
	});
});
