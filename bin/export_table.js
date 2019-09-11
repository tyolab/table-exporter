var ExportJob = require('./export');
var Params = require('node-programmer/params');

function showUsage() {
    console.log('usage: node  ' + __filename + ' url/file [--table-selector table-selector] [--header-selector header-selector] [--row-selector row-selector] [--cell-selector cell-selector] [--target-selector target-selector] [--output-type [csv|json]] [--output-name name]');
    process.exit(-1);
}

var optsAvailable = {
    "table-selector": null,
    "header-selector": null,
    "row-selector": null,
    "cell-selector": null,
    "target-selector": null,
    "output-type": "json",
    "output-name": null,
    "cell-delim": null,
    "row-delim": null
};

var params = new Params(optsAvailable);

var opts = params.getOpts();
var optCount = params.getOptCount();

var inputs = opts['---'];

if (inputs.length === 0) {
    // params.setUsage(optsAvailable);
    // params.showUsage();
    showUsage()
    process.exit(-1);
}

var fileOrUrl = Array.isArray(inputs) ? inputs[0] : inputs;

new ExportJob(fileOrUrl).process(opts); 