/*
 *   Copyright (c) 2020 TYO Lab
 *   @author Eric Tang (twitter: @_e_tang).
 */
/**
 * @file index.js
 */

var TableExporter = require('./lib/exporter');

function isBrowser() {
    try {return this===window;}catch(e){ return false;}
}

var TableExporter = require('./lib/exporter');

function Exporter () {
    this.$ = null;
    this.in_browser = isBrowser();
    this.environment = this.environment || (this.in_browser ? "browser" : "node");
}

/**
 * Export the html page
 */

Exporter.prototype.export = function (html, tableSelector, selectors, findProcessor) {

    this.$ = this.getQuery(html);

    // if (!tableSelector) {
    //     if (_$('table').length)
    //         tableSelector = 'table';
    //     else {
    //         if (_te.in_browser) {
    //             if (_te.alert && typeof _te.alert === 'function')
    //                 _te.alert("No table found.");
    //             return;
    //         }
    //         else
    //             throw ("No table selector found, please specify a proper table selector");
    //     }
    // }

    return this.exportNode(this.$, tableSelector, selectors, findProcessor);
}

/**
 *  sometimes it is easier to export rows rather than a single element
 */

Exporter.prototype.exportRows = function (html, selector, findProcessor) {

        findProcessor = findProcessor || this.linkProcessor.bind(this);

        var $ = this.getQuery(html);

        var exporter = new TableExporter($);
        var i = 0;

        var rows = exporter.exportRows($(this), selector, findProcessor);

        return rows;
    }

Exporter.prototype.getQuery = function (selector, parent) {
    if (this.in_browser) {
        if (typeof $ === 'undefined') {
            var se = document.createElement('script'); 
            se.type = 'text/javascript'; 
            se.async = true;
            se.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js';
            var s = document.getElementsByTagName('script')[0]; 
            s.parentNode.insertBefore(se, s);
        }
        this.$ = $;
        return $(selector || 'html', parent);
    }
    else {
        if (!this.$) {
            var cheerio = require('cheerio');
            this.$ = cheerio.load(selector);
            return this.$;
        }
        return this.$(selector, parent);
    }
}

/**
 * export table with a selector for a particular node
 */

Exporter.prototype.linkProcessor = function ($, nodes, x, y, k) {
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

Exporter.prototype.exportNode = function (node, tableSelector, selectors, findProcessor) {
    var self = this;

    var result = {};
    var tables = [];

    function processNode($node) {
        var exporter = new TableExporter($node);
        var i = 0;

        var $tables;
        if (typeof node === 'object' && !tableSelector)
            // tableSelector should be set before calling this method
            $tables = node;
        else {
                // if table selector is not set, we would just table
            tableSelector = tableSelector || "table";
            $tables = this.in_browser ? self.getQuery(tableSelector, $node) : $node(tableSelector);
        }

        $tables.each(function(index, table) {
            var $table = self.getQuery(table || this);
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

var exporter = new Exporter();

var _te = _te || {};
_te.exporter = exporter;

if (_te.in_browser) {
    // don't declare here, make it flexible
    // _te.alert = _te.alert || alert.bind(window); 
    // window.getQuery = getQuery.bind(window);
    window._te = _te;
}
else {
    // global.getQuery = getQuery.bind(global);
    global._te = _te;
}

module.exports = exporter;
