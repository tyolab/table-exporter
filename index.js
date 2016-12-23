module.exports = function (html, tableSelector, findSelector, findProcessor) {
    var request = require('request');
    var cheerio = require('cheerio');

    var TableExporter = require('./lib/exporter');

    tableSelector = tableSelector | 'table';

    findSelector = findSelector || 'a';
    
    var tables = [];

    findProcessor = findProcessor || function (x, y, k, nodes, $) {
        var urls = [];
        if (nodes.length > 0) {
            
            $(nodes).each(function (i, link) {
                var url = $(link).attr('href');
                var anchor = $(link).text();
                urls.push({url: url, anchor: anchor});
            });
        }
        return urls.length > 0 ? {urls: urls} : null;
    };

    function processHtml(html) {
        var $ = cheerio.load(html);

        var exporter = new TableExporter($);

        //var data = exporter.exportTableToCSV(/* selector to export */'table');

        var i = 0;
        $('table').each(function() {
            var table = exporter.export($(this), i, findSelector, findProcessor);
            tables.push(table);
            ++i;
        });

        return tables;
    }

    return processHtml(html);
}