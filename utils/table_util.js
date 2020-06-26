/*
 *   Copyright (c) 2020 
 *   @author Eric Tang (twitter: @_e_tang).
 */
const Table = require('../lib/table');
const TableHtmlTable = require('../lib/table_html_table');
const TableHtmlList = require('../lib/table_html_list');

const table_util = {
    table: new Table(),

    table_html_table: new TableHtmlTable(),
    
    table_html_list: new TableHtmlList(),

    to_html_css_table: function(headers, rows) {
        return this.table.makeHtmlTable(headers, rows);
    },

    to_html_table: function(headers, rows) {
        return this.table_html_table.makeHtmlTable(headers, rows);
    },

    to_html_list_table: function(headers, rows) {
        return this.table_html_list.makeHtmlTable(headers, rows);
    },

    to_csv: function(table, cell_delim, row_delim) {
        return this.table.generate_csv(table, cell_delim, row_delim);
    }

}

module.exports = table_util;