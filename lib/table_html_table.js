/**
 * @file table_html_css.js
 * 
 * Making a table with css
 */

const Table = require('../lib/table');

const util = require('util');

function TableHtmlTable(inColDelim, inRowDelim) {
    Table.call(this, inColDelim, inRowDelim);

    this.classCellDivider = null; 
    this.classTable = '';
    this.classCellDivider = '';
    this.classHeaderCell = '';
    this.classTableHeader = '';
    this.classCell = '';
    this.classRow = '';        
}

util.inherits(TableHtmlTable, Table);

TableHtmlTable.prototype.makeCellDiv = function(index, cellData, styleStr) {
    return `<td class="${styleStr || ''} col-${index}">${cellData}</td>`;
}

TableHtmlTable.prototype.makeRowDiv = function(cols, joined_by) {
    return `<tr class="${this.classRow}" style="${this.styleRow}">`
                                 + cols.join(joined_by ||' \n') +
                                `</tr>`;
}

TableHtmlTable.prototype.makeHeaderDiv = function(headers, joined_by) {
    return `<tr class="${this.classTableHeader}">` + 
    headers.join(joined_by || " \n") +
`</tr>`;
}

TableHtmlTable.prototype.makeCellDividerDiv = function() {
    if (this.classCellDivider)
        return `<div class="${this.classCellDivider}"></div>`;
    return '';
}

TableHtmlTable.prototype.makeHeaderCellDiv = function(index, headerCol) {
    return (`<th class="${this.classHeaderCell} col-${index}">${headerCol}</th>`);
}

TableHtmlTable.prototype.makeTableDiv = function(rows, joined_by) {
    return  (
        `<table class="${this.classTable}">`
            +
            rows.join(joined_by ||' \n')
            +
        `</table>`
    );
}

module.exports = TableHtmlTable;
