/*
 *   Copyright (c) 2020 TYONLINE TECHNOLOGY PTY. LTD. (TYO Lab) All rights reserved. 
 *   @author Eric Tang (twitter: @_e_tang).
 */
/**
 * @file table.js
 */

//------------------------------------------------------------
// Helper Functions 
//------------------------------------------------------------
// Format the output so it has the appropriate delimiters
function isWindows() {
    return typeof navigator !== 'undefined' && navigator && navigator.platform && navigator.platform.indexOf('Win') > -1
}

const defaultRowDelim = isWindows() ? '\r\n' : '\n';

function formatRows(rows, colDelim, rowDelim) {
    colDelim = colDelim || ',';
    rowDelim = rowDelim || defaultRowDelim;

    return rows.get().join(rowDelim)
        .split(rowDelim).join(rowDelim)
        .split(colDelim).join(colDelim);
}

function formatHeader(rows, colDelim) {
    colDelim = colDelim || ',';

    return rows.join(colDelim);
}

function newFormatRows(rows, colDelim, rowDelim) {
    colDelim = colDelim || ',';
    rowDelim = rowDelim || defaultRowDelim;

    return rows.join(rowDelim)
        .split(rowDelim).join(rowDelim)
        .split(colDelim).join(colDelim);
}

 function Table(inColDelim, inRowDelim) {

    var
    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    tmpColDelim = inColDelim || String.fromCharCode(11) // vertical tab character
    ,tmpRowDelim = inRowDelim || String.fromCharCode(0) // null character

    // styles
    this.classTable = "data-table";
    this.classCellDivider = "data-table-cell-divider";
    this.classHeaderCell = "data-table-header-cell";
    this.classTableHeader = "data-table-header";
    this.classCell = 'data-table-cell';
    this.classRow = 'data-table-row';

    this.styleRow = '';

    
    // Rows
    this.data_index = 0;
};

 
//
Table.prototype.createTableHeader = function(headerRow, groupsSize) {
    var headers = [];
    groupsSize = groupsSize || 1;
    for (var g = 0; g < groupsSize; ++g) {
        if (g > 0)
            headers.push(this.makeCellDividerDiv());   

        for (var i = 0; i < headerRow.length; i++) {
            headers.push(this.makeHeaderCellDiv(i, headerRow[i]));
        } 
    }

    return (
            this.makeHeaderDiv(headers));

}; 
 
Table.prototype.makeCellDiv = function(index, cellData, styleStr) {
    return `<div class="${styleStr}">${cellData}</div>`;
}

Table.prototype.makeRowDiv = function(cols, joined_by) {
    return `<div class="${this.classRow}" style="${this.styleRow}">`
                                 + cols.join(joined_by ||' \n') +
                                `</div>`;
}

Table.prototype.makeHeaderDiv = function(headers, joined_by) {
    return `<div class="${this.classTableHeader}">` + 
    headers.join(joined_by || " \n") +
`</div>`;
}

Table.prototype.makeCellDividerDiv = function() {
    return `<div class="${this.classCellDivider}"></div>`;
}

Table.prototype.makeHeaderCellDiv = function(index, headerCol) {
    return (`<div class="${this.classHeaderCell}">${headerCol}</div>`);
}

Table.prototype.makeTableDiv = function(rows, joined_by) {
    return  (
        `<div class="${this.classTable}">`
            +
            rows.join(joined_by ||' \n')
            +
        `</div>`
    );
}

/**
 * If you need to make an empty table with just headers
 * you need to pass on (headers, []) // 
 */
Table.prototype.makeHtmlTable = function(headers, rows, joined_by) {
    if (!rows && headers && headers.length) {
        rows = headers;
        headers = null;
    }

    var table_array = [];

    if (rows && rows.length) {
        var rowsSize = rows.length;
        var groupsSize = 1;
        if (this.splitToColumnGroupSize > 0 && rowsSize > this.splitToColumnGroupSize)
            groupsSize = Math.ceil(rowsSize / this.splitToColumnGroupSize);

        // Header
        if (headers) {
            var header = this.createTableHeader(headers, groupsSize);
            table_array.push(header);
        }

        // Rows
        for (var x = this.data_index; x < rowsSize;) {
            var cols = [];
            
            // can't remember the purpose of this style
            // const styleStr = this.classCell + ((x > 1 && (x % 2) === 0) ? '2' : '');

            for (var g = 0; g < groupsSize; g++) {
                if (g > 0)
                    cols.push(this.makeCellDividerDiv());  

                var dataRow = rows[x];

                var colsCount = (dataRow.length && dataRow.length > 0) ? dataRow.length : 0;

                for (var i = 0; i < colsCount; i++) {
                    cols.push(
                            this.makeCellDiv(i, dataRow[i])
                        );     
                }

                ++x;
                if (x >= rowsSize)
                    break;
            }

            if (cols.length > 0)
                table_array.push(this.makeRowDiv(cols));
            cols = [];
        }
    }

    return this.makeTableDiv(table_array);
}

/**
 */
Table.prototype.makeHtmlTables = function (tableObj, headerInRowIndex) {
    this.prepareTable();

    headerInRowIndex = headerInRowIndex || -1;

    var tables = [];

    for (var sheetName in tableObj) {
        var data = tableObj[sheetName];

        // Column Groups
        if (!data || !data.length)
            continue;

        // Header
        var headers = null;
        if (this.headers || headerInRowIndex > -1) {
            headers = this.headers || data[0];
        }
        
        var table = this.makeHtmlTable(headers, data);
        tables.push(table);
    }
    return tables;
}


Table.prototype.generate_csv = function (table, cellDelim, rowDelim) {

    // Grab text from table into CSV formatted string
    var csv = '';
    if (table.headers) {
        csv += formatHeader(table.headers, cellDelim, rowDelim);
        csv += (rowDelim || defaultRowDelim);
    }
    if (table.rows && table.rows.length)
        csv += newFormatRows(table.rows, cellDelim, rowDelim);

    return csv;
}   

Table.prototype.exportTableToCSV = function($table) {
    var $headers = $table.find('tr:has(th)')
        ,$rows = $table.find('tr:has(td)')


    // Grab text from table into CSV formatted string
    var csv = '"';
    csv += formatRows($headers.map(grabRow));
    csv += rowDelim;
    csv += formatRows($rows.map(grabRow)) + '"';
    
    return csv;
}

 module.exports = Table;