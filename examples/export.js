/**
 * @file export.js
 */

var fs = require('fs');
var exporter = require('../index');
var request = require('request');

if (process.argv.length < 3) {
    console.log('usage: node . url/file [tag]');
    process.exit(-1);
}

if (process.argv.length > 3) {
    tag = process.argv[3];
}

var fileOrUrl = process.argv[2];
var obj;

function exportFile(html, exportFn) {
    var obj = exportFn(html);
    console.log(JSON.stringify(obj));
}

function ExportJob (fileOrUrl, exportFn) {
    exportFn = exportFn || exporter.export;

    this.process = function () {
        try {
            fs.accessSync(fileOrUrl, fs.F_OK);
            // Do something

            // It isn't accessible

           fs.readFileSync(fileOrUrl, function (err, html) {
                exportFile(html, exportFn);
            });

        } catch (e) {
            request(fileOrUrl, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    exportFile(html, exportFn);
                }
            });
        }
    }

}

module.exports = ExportJob;

