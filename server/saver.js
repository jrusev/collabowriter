module.exports =  function () {
    
    var client = require('share').client;
    var fs = require('fs');

    var argv = require('optimist')
        .usage('Usage: $0 -d docname [--url URL] [-f filename]')["default"]
        ('d', 'hello')["default"]
        ('url', 'http://sharejs.org:8000/sjs')
        .argv;

    var filename = argv.f || argv.d;

    console.log("Opening '" + argv.d + "' at " + argv.url + ". Saving to '" + filename + "'");

    var timeout = null;
    var doc = null;
    var write = function () {
        if (timeout === null) {
            return timeout = setTimeout(function () {
                console.log("Saved version " + doc.version);
                fs.writeFile(filename, doc.snapshot);
                return timeout = null;
            }, 1000);
        }
    };

    client.open(argv.d, 'text', argv.url, function (error, d) {
        doc = d;
        console.log('Document ' + argv.d + ' open at version ' + doc.version);
        write();
        return doc.on('change', function (op) {
            return write();
        });
    });
}