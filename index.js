/**
 * @file index.js
 */

var isBrowser=new Function("try {return this===window;}catch(e){ return false;}");

function getQuery(html) {
    if (isBrowser()) {

        if (!$) {
            var se = document.createElement('script'); 
            se.type = 'text/javascript'; 
            se.async = true;
            se.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(se, s);
        }
        return $(html || 'html');
    }
    else {
        var cheerio = require('cheerio');
        return cheerio.load(html);
    }
}

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
            // search from the root if we don't have the table selector
            var table = exporter.export($("html"), 0, selectors, findProcessor);
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

    var _$ = ;

    if (!tableSelector) {
        if ($('table').length)
            tableSelector = 'table';
    }

    // findProcessor = findProcessor || linkProcessor;

    return exportNode(_$, tableSelector, selectors, targetSelector, findProcessor);
}

/**
 *  sometimes it is easier to export rows rather than a single element
 */

module.exports.exportRows = function (html, selector, findProcessor) {

    // targetSelector = targetSelector || 'a';

    findProcessor = findProcessor || linkProcessor;

    var $ = getQuery(html);

    var exporter = new TableExporter($);
    var i = 0;

    var rows = exporter.exportRows($(this), selector, findProcessor);

    return rows;
}
