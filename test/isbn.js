var assert = require("assert"); // node.js core module
var ISBNParser = require("../utility/isbn.js");

var showData = process.env.SHOW_DATA||false;

describe('ISBN', function() {
	describe('var isbn10a = ISBNParser.parse("4873113369")', function() {
		var isbn10a = ISBNParser.parse('4873113369');
		it('should not be null', function() {
			assert.notEqual(null,isbn10a);
		});
		it('isbn10a.isIsbn10() should be true', function() {
			assert.ok(isbn10a.isIsbn10());
		});
		it('isbn10a.isIsbn13() should be false', function() {
			assert.equal(false, isbn10a.isIsbn13());
		});
		it('isbn10a.asIsbn10() should be "4873113369"', function() {
			assert.equal("4873113369", isbn10a.asIsbn10());
		});
		it('isbn10a.isIsbn10(true) should be "4-87311-336-9"', function() {
			assert.equal("4-87311-336-9", isbn10a.asIsbn10(true));
		});
		it('isbn10a.asIsbn13() should be "9784873113364"', function() {
			assert.equal("9784873113364", isbn10a.asIsbn13());
		});
		it('isbn10a.asIsbn13(true) should be "978-4-87311-336-4"', function() {
			assert.equal("978-4-87311-336-4", isbn10a.asIsbn13(true));
		});
	});
	describe('var isbn10b = ISBNParser.parse("1-933988-03-7")', function() {
		var isbn10b = ISBNParser.parse('1-933988-03-7');
		it('isbn10b.isIsbn10() should be true', function() {
			assert.ok(isbn10b.isIsbn10());
		});
	});
	describe('var isbn13a = ISBNParser.parse("978-4-87311-336-4")', function() {
		var isbn13a = ISBNParser.parse('978-4-87311-336-4');
		it('isbn13a.isIsbn13() should be true', function() {
			assert.ok(isbn13a.isIsbn13());
		});
		it('isbn13a.codes.source should be "978-4-87311-336-4"', function() {
			assert.equal("978-4-87311-336-4", isbn13a.codes.source);
		});
		it('isbn13a.codes.prefix should be "978"', function() {
			assert.equal("978", isbn13a.codes.prefix);
		});
		it('isbn13a.codes.group should be "4"', function() {
			assert.equal("4", isbn13a.codes.group);
		});
		it('isbn13a.codes.publisher should be "87311"', function() {
			assert.equal("87311", isbn13a.codes.publisher);
		});
		it('isbn13a.codes.article should be "336"', function() {
			assert.equal("336", isbn13a.codes.article);
		});
		it('isbn13a.codes.check should be "4"', function() {
			assert.equal("4", isbn13a.codes.check);
		});
		it('isbn13a.codes.check10 should be "9"', function() {
			assert.equal("9", isbn13a.codes.check10);
		});
		it('isbn13a.codes.check10 should be "4"', function() {
			assert.equal("4", isbn13a.codes.check13);
		});
		it('isbn13a.codes.check10 should be "Japan"', function() {
			assert.equal("Japan", isbn13a.codes.groupname);
		});
	});
	describe('var isbn13b = ISBNParser.parse("9781590597279")', function() {
		var isbn13b = ISBNParser.parse('9781590597279');
		it('isbn13b.isIsbn13() should be true', function() {
			assert.ok(isbn13b.isIsbn13());
		});
	});
	describe('var foo = ISBNParser.parse("invalid format")', function() {
		var foo = ISBNParser.parse('invalid format');
		it('foo should be null', function() {
			assert.equal(null,foo);
		});
	});
	it('ISBNParser.asIsbn13("4-87311-336-9") should be "9784873113364"', function() {
		assert.equal("9784873113364",ISBNParser.asIsbn13('4-87311-336-9'));
	});
	it('ISBNParser.asIsbn10("978-4-87311-336-4", true) should be "4-87311-336-9"', function() {
		assert.equal("4-87311-336-9",ISBNParser.asIsbn10('978-4-87311-336-4', true));
	});
	it('ISBNParser.hyphenate("9784873113364") should be "978-4-87311-336-4"', function() {
		assert.equal("978-4-87311-336-4",ISBNParser.hyphenate('9784873113364'));
	});
});
