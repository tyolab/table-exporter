module.exports = function (html, selector) {
    var request = require('request');
    var cheerio = require('cheerio');

    var TableExporter = require('./lib/exporter');

    selector = selector | 'table';

    function processHtml(html) {
        var $ = cheerio.load(html);

        var exporter = new TableExporter($);

        //var data = exporter.exportTableToCSV(/* selector to export */'table');

        var array = [];
        $('table').each(function() {
            var table = exporter.exportTableToJSON($(this));
            array.push(table);
        });

        return array;
    }

    return processHtml(html);
}