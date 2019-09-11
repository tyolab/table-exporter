/**
 * @file export.js
 */

var fs = require('fs');
var exporter = require('../index');
var request = require('request');

function exportFile(html, exportFn, opts) {
    var result = exportFn(html, opts["table-selector"], [opts["header-selector"], opts["row-selector"], opts["cell-selector"]], opts["target-selector"]);

    if (result.tables && result.tables.length && result.tables.length > 0) {
        if (opts["output-name"]) {
            var outname = opts["output-name"] + '.' + opts["output-type"];
            
            // by default we only export csv file
            var i = 0;
            for (; i < result.tables.length; ++i) {
                if (i === 1) {
                    outname = opts["output-name"] + '.' + opts["output-type"];
                }
                else {
                    outname = opts["output-name"] + i + '.' + opts["output-type"];
                }

                result.tables[i].exporter.generateOutput(result.tables[i], opts["cell-delim"]);
            }
        }
        else
            console.log(JSON.stringify(result.tables));
    }
    else {
        console.error("No table found");
    }
}

function ExportJob (fileOrUrl, exportFn) {
    exportFn = exportFn || exporter.export;

    this.process = function (opts) {
        try {
            fs.accessSync(fileOrUrl, fs.F_OK);
            // @todo 
            // Do something
            // If file isn't accessible

           fs.readFile(fileOrUrl, function (err, html) {
                exportFile(html, exportFn, opts);
            });

        } catch (e) {
            request(fileOrUrl, function (error, response, html) {
                if (!error && response.statusCode == 200) {
                    exportFile(html, exportFn, rowSelector, cellSelector);
                }
            });
        }
    }

}

module.exports = ExportJob;

