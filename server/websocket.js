'use strict';

var Duplex = require('stream').Duplex;
var WebSocketServer = require('ws').Server;

module.exports = function init(httpServer, shareServer) {

    var wss = new WebSocketServer({
        server: httpServer
    });

    // Ping clients to keep Heroku server awake
    setInterval(function () {
        var ping = {
            'ping': new Date()
        };
        var message = JSON.stringify(ping);
        for (var i in wss.clients) {
            wss.clients[i].send(message);
            console.log(new Date());
        }
    }, 10000);

    wss.on('connection', function (client) {
        var stream;
        stream = new Duplex({
            objectMode: true
        });
        stream._write = function (chunk, encoding, callback) {
            console.log('s->c ', chunk);
            client.send(JSON.stringify(chunk));
            return callback();
        };
        stream._read = function () {};
        stream.headers = client.upgradeReq.headers;
        stream.remoteAddress = client.upgradeReq.connection.remoteAddress;
        client.on('message', function (data) {
            console.log('c->s ', data);
            return stream.push(JSON.parse(data));
        });
        stream.on('error', function (msg) {
            return client.close(msg);
        });
        client.on('close', function (reason) {
            stream.push(null);
            stream.emit('close');
            console.log('client went away');
            return client.close(reason);
        });
        stream.on('end', function () {
            return client.close();
        });
        return shareServer.listen(stream);
    });
}