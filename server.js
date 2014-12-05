var Duplex = require('stream').Duplex;
var connect = require('connect');
var livedb = require('livedb');
var livedbMongo = require('livedb-mongo');
var http = require('http');
var morgan = require('morgan');
var serveStatic = require('serve-static');
var sharejs = require('./lib');

var app = connect();
app.use(morgan());
app.use('/srv', serveStatic(sharejs.scriptsDir));
app.use(serveStatic("" + __dirname + "/public"));

var backend = livedb.client(livedb.memory());
// backend = livedb.client livedbMongo('localhost:27017/test?auto_reconnect', safe:false)

var share = sharejs.server.createClient({
    backend: backend
});

var server = http.createServer(app);
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({
    server: server
});

// Ping clients to keep Heroku server awake
setInterval(function () {
    var ping = { 'ping': new Date() };
    var message = JSON.stringify(ping);
    for(var i in wss.clients) {
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
    return share.listen(stream);
});

var port = process.env.PORT || 7007;
server.listen(port);
console.log("Listening on http://localhost:" + port + "/");