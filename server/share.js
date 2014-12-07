'use strict';

var sharejs = require('../sharejs');

module.exports = function (httpServer) {

    var backend = require('./livedb');    
    var shareServer = sharejs.server.createClient({backend: backend});
    require('./websocket')(httpServer, shareServer);
}