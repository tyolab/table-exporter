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

function exportNode (node, tableSelector, selectors, findProcessor) {
    var result = {};
    var tables = [];

    function processNode($) {
        var exporter = new TableExporter($);
        var i = 0;

        if (tableSelector)
            $(tableSelector).each(function() {
                var table = exporter.export($(this), i, selectors, findProcessor);
                if (null != table)
                    tables.push(table);
                ++i;
            });
        else {
            var table = exporter.export($, 0, selectors, findProcessor);
            if (null != table)
                tables.push(table);
        }

        result.tables = tables;
        result.exporter = exporter;
        return result;
    }
    return processNode(node);
}

/**
 * Export the html page
 */

module.exports.export = function (html, tableSelector, selectors, targetSelector, findProcessor) {

    var $ = cheerio.load(html);

    if (!tableSelector) {
        if ($('table').length)
            tableSelector = 'table';
    }

    // findProcessor = findProcessor || linkProcessor;

    return exportNode($, tableSelector, selectors, targetSelector, findProcessor);
}

/**
 *  sometimes it is easier to export rows rather than a single element
 */

module.exports.exportRows = function (html, selector, findProcessor) {

    // targetSelector = targetSelector || 'a';

    findProcessor = findProcessor || linkProcessor;

    var $ = cheerio.load(html);

    var exporter = new TableExporter($);
    var i = 0;

    var rows = exporter.exportRows($(this), selector, findProcessor);
    // [];
    // $nodes = $(rowSelector);
    // $nodes.each(function() {
    //     var row = exporter.exportRow($(this), i, colSelector, targetSelector, findProcessor);
    //     if (row && row.length > 0) {
    //         rows.push(row);
    //         ++i;
    //     }
    // });

    return rows;
}
