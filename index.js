var request = require('request');
var cheerio = require('cheerio');


var request = require('request');
var cheerio = require('cheerio');

var fs = require('fs');

var TableExporter = require('./lib/exporter');

function processHtml(html) {
    var $ = cheerio.load(html);

    var exporter = new TableExporter($);

    var data = exporter.exportTableToCSV($('#dvData > table'));

    console.log(data);
}

if (true) {
    fs.readFile(process.argv[2], function (err, html) {
        processHtml(html);
    });
}
else {
    request(process.argv[2], function (error, response, html) {
    if (!error && response.statusCode == 200) {
        processHtml(html);
    }
    });
}