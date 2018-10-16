//require('newrelic');
var server = require('./main.js'),
	portNo = process.env.PORT || 3000;

server(portNo);
