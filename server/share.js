'use strict';

var sharejs = require('share');
var livedb = require('livedb');
var livedbMongo = require('livedb-mongo');

module.exports = function (server) {

    // backend = livedb.client(livedbMongo('localhost:27017/test?auto_reconnect', {safe:false}))
    var shareServer = sharejs.server.createClient({
        backend: livedb.client(livedb.memory())
    });

    require('./websocket')(server, shareServer);
}