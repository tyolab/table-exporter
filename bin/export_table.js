var ExportJob = require('./export');
var Params = require('node-programmer/params');

function showUsage() {
    console.log('usage: node  ' + __filename + ' url/file' + `
        \nAvailable Options:
        \t\t\t[--table-selector table-selector] 
        \t\t\t[--header-selector header-selector] 
        \t\t\t[--row-selector row-selector] 
        \t\t\t[--cell-selector cell-selector] 
        \t\t\t[--target-selector target-selector] 
        \t\t\t[--output-type [csv|json]]
        \t\t\t[--output-name name]
        \t\t\t[--cell-delim delim]
        `
        );
    process.exit(-1);
}

var optsAvailable = {
    "table-selector": null,
    "header-selector": null,
    "column-selector": null,
    "row-selector": null,
    "cell-selector": null,
    "target-selector": null,
    "output-type": "json",
    "output-name": null,
    "cell-delim": null,
    "row-delim": "\n",
};

var params = new Params(optsAvailable);

var opts = params.getOpts();
var optCount = params.getOptCount();

var inputs = opts['---'];

if (!inputs || inputs.length === 0) {
    // params.setUsage(optsAvailable);
    // params.showUsage();
    showUsage()
    process.exit(-1);
}

var fileOrUrl = Array.isArray(inputs) ? inputs[0] : inputs;

new ExportJob(fileOrUrl).process(opts); 