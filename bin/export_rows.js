var ExportJob = require('./export');
var exportFn = require('../index').exportRows;

function usage() {
    console.log('usage: node ' + __filename + ' url/file row-selector col-selector');
    process.exit(-1);
}

var rowSelector, colSelector;

if (process.argv.length > 4) {
    rowSelector = process.argv[3];
    colSelector = process.argv[4];
}
else {
    usage();
}

var fileOrUrl = process.argv[2];

new ExportJob(fileOrUrl, exportFn).process(rowSelector, colSelector);