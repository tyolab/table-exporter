/**
 * @file table_html_table.js
 * 
 * Making a table with html table tag
 */

const Table = require('./table');

const util = require('util');

function TableHtmlList(inColDelim, inRowDelim) {
    Table.call(inColDelim, inRowDelim);

    this.classCellDivider = null; 
    this.classTable = '';
    this.classCellDivider = '';
    this.classHeaderCell = '';
    this.classTableHeader = '';
    this.classCell = '';
    this.classRow = '';
}

util.inherits(TableHtmlList, Table);

TableHtmlList.prototype.makeCellDiv = function(index, cellData, styleStr) {
    return `<div class="${styleStr} col-${index}">${cellData}</div>`;
}

TableHtmlList.prototype.makeRowDiv = function(cols, joined_by) {
    return `<li class="${this.classRow}" style="${this.styleRow}">`
                                 + cols.join(joined_by ||' \n') +
                                `</li>`;
}

TableHtmlList.prototype.makeHeaderDiv = function(headers, joined_by) {
    return `<li class="${this.classTableHeader}">` + 
    headers.join(joined_by || " \n") +
`</li>`;
}

TableHtmlList.prototype.makeCellDividerDiv = function() {
    return `<div class="${this.classCellDivider}"></div>`;
}

TableHtmlList.prototype.makeHeaderCellDiv = function(index, headerCol) {
    return (`<div class="${this.classHeaderCell} col-${index}">${headerCol}</div>`);
}

TableHtmlList.prototype.makeTableDiv = function(rows, joined_by) {
    return  (
        `<ul class="${this.classTable}">`
            +
            rows.join(joined_by ||' \n')
            +
        `</ul>`
    );
}


module.exports = TableHtmlList;