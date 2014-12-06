var express = require('express');
var http = require('http');
var logger = require('morgan');

var app = express();
app.use(logger('combined'));
app.use(express.static('' + __dirname + '/public'));

var server = http.createServer(app);
require('./server/share')(server);

var port = process.env.PORT || 7007;
server.listen(port);
console.log('Listening on http://localhost:' + port + '/');