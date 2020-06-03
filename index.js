/**
 * @file index.js
 */

var _te = _te || {};

function isBrowser() {
    try {return this===window;}catch(e){ return false;}
}

function getQuery(html) {
    if (_te.in_browser) {

        if (typeof $ === 'undefined') {
            var se = document.createElement('script'); 
            se.type = 'text/javascript'; 
            se.async = true;
            se.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(se, s);
        }
        _te.$ = $;
        return $(html || 'html');
    }
    else {
        if (Buffer.isBuffer(html)) {
            var cheerio = require('cheerio');
            _te.$ = cheerio.load(html);
            return _te.$;
        }
        else if (typeof html === 'string')
            return _te.$(htm);
        return _te.$(html);
    }
}

_te.in_browser = isBrowser();
_te.environment = _te.environment || (_te.in_browser ? "browser" : "node");
_te.getQuery = getQuery;

if (_te.in_browser) {
    _te.alert = _te.alert || alert.bind(window); 
    window.getQuery = getQuery.bind(window);
    window._te = _te;
}
else {
    global.getQuery = getQuery.bind(global);
    global._te = _te;
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

    // if table selector is not set, we would just table
    tableSelector = tableSelector || "table";

    function processNode($node) {
        var exporter = new TableExporter($node);
        var i = 0;

        var $tables = _te.in_browser ? getQuery(tableSelector) : $node(tableSelector);

        $tables.each(function(index, table) {
            var $table = getQuery(table || this);
            var table = exporter.export($table, i, selectors, findProcessor);
            if (null != table)
                tables.push(table);
            ++i;
        });

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

    var _$ = getQuery(html);

    if (!tableSelector) {
        if ($('table').length)
            tableSelector = 'table';
        else {
            if (_te.in_browser) {
                if (_te.alert && typeof _te.alert === 'function')
                    _te.alert("No table found.");
                return;
            }
            else
                throw new Exception("No table selector found, please specify a proper table selector");
        }
    }

    return exportNode(_$, tableSelector, selectors, targetSelector, findProcessor);
}

/**
 *  sometimes it is easier to export rows rather than a single element
 */

module.exports.exportRows = function (html, selector, findProcessor) {

    findProcessor = findProcessor || linkProcessor;

    var $ = getQuery(html);

    var exporter = new TableExporter($);
    var i = 0;

    var rows = exporter.exportRows($(this), selector, findProcessor);

    return rows;
}
