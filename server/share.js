'use strict';

var sharejs = require('./sharejs');
var backend = require('./livedb');

module.exports = function (httpServer) {
    var shareServer = sharejs.server.createClient({
        backend: backend
    });
    require('./websocket')(httpServer, shareServer);
}