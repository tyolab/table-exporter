/**
 * @file export.js
 */

var fs = require('fs');
var exporter = require('../index');
var request = require('request');

if (process.argv.length < 3) {
    console.log('usage: node  ' + __filename + ' url/file [tag]');
    process.exit(-1);
}

if (process.argv.length > 3) {
    tag = process.argv[3];
}

var fileOrUrl = process.argv[2];
var obj;

function exportFile(html, exportFn, rowSelector, colSelector) {
    var obj = exportFn(html, rowSelector, colSelector);
    console.log(JSON.stringify(obj));
}

function ExportJob (fileOrUrl, exportFn) {
    exportFn = exportFn || exporter.export;

    this.process = function (rowSelector, colSelector) {
        try {
            fs.accessSync(fileOrUrl, fs.F_OK);
            // @todo 
            // Do something
            // If file isn't accessible

           fs.readFile(fileOrUrl, function (err, html) {
                exportFile(html, exportFn, rowSelector, colSelector);
            });

        } catch (e) {
            request(fileOrUrl, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    exportFile(html, exportFn, rowSelector, colSelector);
                }
            });
        }
    }

}

module.exports = ExportJob;

