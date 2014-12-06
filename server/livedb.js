'use strict';

var livedb = require('livedb');
var livedbMongo = require('livedb-mongo');

var cloudDb = 'mongodb://admin:123456q@ds055690.mongolab.com:55690/collabowriter';
var localDb = 'mongodb://localhost/collab?auto_reconnect';

var db = process.env.NODE_ENV ? cloudDb : localDb;

// var backend = livedb.client(livedb.memory());
var backend = livedb.client(livedbMongo(db, {
    safe: false
}));

module.exports = backend;