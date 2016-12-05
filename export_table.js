

var fs = require('fs');
var exportFn = require('./index');

if (process.argv.length < 3) {
    console.log('usage: node . url/file [tag]');
    process.exit(-1);
}

if (process.argv.length > 3) {
    tag = process.argv[3];
}

var fileOrUrl = process.argv[2];
var obj;

function doJob (html) {
    var links = [];

    obj = exportFn(html);
    console.log("tables:");
    console.log(JSON.stringify(obj.tables));

    // we look for links too
    if (obj.links && obj.links.length > 0) {
        console.log("links:");
        console.log(JSON.stringify(obj.links));
    }
}

try {
    fs.accessSync(fileOrUrl, fs.F_OK);
    // Do something

    // It isn't accessible

    fs.readFile(fileOrUrl, function (err, html) {
        doJob(html);
    });

} catch (e) {
    request(fileOrUrl, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            doJob(html);
        }
    });
}