/**
 * @file index.js
 */

var cheerio = require('cheerio');

var TableExporter = require('./lib/exporter');

/**
 * export table with a selector for a particular node
 */

function linkProcessor ($, nodes, x, y, k) {
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

/**
 * Export from parsed node by jQuery or Cheerio
 */

function exportNode (node, tableSelector, findSelector, findProcessor) {
    var tables = [];

    function processNode($) {
        var exporter = new TableExporter($);
        var i = 0;
        $('table').each(function() {
            var table = exporter.export($(this), i, findSelector, findProcessor);
            tables.push(table);
            ++i;
        });

        return tables;
    }
    return processNode(node);
}

/**
 * Export the html page
 */

module.exports.export = function (html, tableSelector, findSelector, findProcessor) {

    tableSelector = tableSelector | 'table';

    findSelector = findSelector || 'a';

    findProcessor = findProcessor || linkProcessor;

    var $ = cheerio.load(html);
    return exportNode($, tableSelector, findSelector, findProcessor);
}

/**
 *  sometimes it is easier to export rows rather than a single element
 */

module.exports.exportRows = function (html, rowSelector, colSelector, findSelector, findProcessor) {

    findSelector = findSelector || 'a';

    findProcessor = findProcessor || linkProcessor;

    var rows = [];

    var $ = cheerio.load(html);

    var exporter = new TableExporter($);
    var i = 0;
    $nodes = $(rowSelector);
    $nodes.each(function() {
        var row = exporter.exportRow($(this), i, colSelector, findSelector, findProcessor);
        if (row && row.length > 0) {
            rows.push(row);
            ++i;
        }
    });

    return rows;
}
