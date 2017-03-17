var ExportJob = require('./export');
var exportFn = require('../index').exportRows;

if (process.argv.length < 3) {
    console.log('usage: node . url/file [tag]');
    process.exit(-1);
}

if (process.argv.length > 3) {
    tag = process.argv[3];
}

var fileOrUrl = process.argv[2];

new ExportJob(fileOrUrl, exportFn).process();