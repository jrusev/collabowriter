'use strict';

var sharejs = require('share');
var livedb = require('livedb');
var livedbMongo = require('livedb-mongo');

module.exports = function (httpServer) {
    var backend = livedb.client(livedbMongo('mongodb://localhost/collab?auto_reconnect', {safe:false}))
    // var backend = livedb.client(livedb.memory());
    var shareServer = sharejs.server.createClient({
        backend: backend
    });

    require('./websocket')(httpServer, shareServer);
}