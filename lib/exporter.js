    
/**
 * Code from: https://bl.ocks.org/kalebdf/ee7a5e7f44416b2116c0
 * 
 * Original Author: Adila Faruk
 */

var defaultRowDelim = '\n';

var os = process.platform;
if (os == "darwin") {
} 
else if (os == "win32" || os == "win64") {
    defaultRowDelim = '\r\n';
} 
else if (os == "linux") {
}

function TableExporter ($, inColDelim, inRowDelim)  {
    var
    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    tmpColDelim = inColDelim || String.fromCharCode(11) // vertical tab character
    ,tmpRowDelim = inRowDelim || String.fromCharCode(0) // null character

    // actual delimiter characters for CSV format

    //------------------------------------------------------------
    // Helper Functions 
    //------------------------------------------------------------
    // Format the output so it has the appropriate delimiters
    function formatRows(rows, colDelim, rowDelim) {
        colDelim = colDelim || ',';
        rowDelim = rowDelim || defaultRowDelim;

        return rows.get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim);
    }

    function formatHeader(rows, colDelim) {
        colDelim = colDelim || ',';

        return rows.join(colDelim);
    }

    function newFormatRows(rows, colDelim, rowDelim) {
        colDelim = colDelim || ',';
        rowDelim = rowDelim || defaultRowDelim;

        return rows.join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim);
    }

    // Grab and format a row from the table
    function grabRow(i, row){
            
        var $row = getQuery(row);
        //for some reason $cols = $row.find('td') || $row.find('th') won't work...
        var $cols = $row.find('td'); 
        if(!$cols.length) $cols = $row.find('th');  

        return $cols.map(grabCol)
                    .get().join(tmpColDelim);
    }

    // Grab and format a column from the table 
    function grabCol(j,col){
        var $col = getQuery(col),
            $text = $col.text();

        return $text.replace('"', '""'); // escape double quotes

    }

    //------------------------------------------------------------
    // Helper Functions for JavaScript objects
    //------------------------------------------------------------

    // Grab and format a row from the table
    function toColumns(rowIndex, row, tableIndex, cellSelector,targetSelector, selectorProcessor) {

        var $row = getQuery(row);
        //for some reason $cols = $row.find('td') || $row.find('th') won't work...
        var $cols = $row.find(cellSelector); 
        // if(!$cols.length) $cols = $row.find('th');  

        var colArray = [];

        $cols.each((colIndex, col) => {
            var $col = getQuery(col),
                $text = $col.text().trim();

            var obj;

            if (targetSelector && selectorProcessor) {
                var $nodes = $(targetSelector, col);
                if ($nodes.length > 0) {
                    obj = selectorProcessor($, $nodes, rowIndex, colIndex, tableIndex);                   
                }
            }

            if (obj) {
                obj.text = $text;
            }
            else {
                obj = $text;
            }

            colArray.push(obj);
        });
        return colArray; //[$cols.map(toColObj).get()];
    }

    // Grab and format a column from the table 
    function toColumn(j, col){
        var $col = getQuery(col),
            $text = $col.text();

        return $text.replace('"', '""'); // escape double quotes

    }

    this.dollar = getQuery($);
    this.table = null;

    this.$ = function(selector) {
        return this.dollar(selector);
    }

    /**
     * Table to JSON
     * 
     * 
     * [
     * {
     * "headers":['', '', ...],
     * "rows":[['', '', ...],
     * ...
     * ]
     * }
     * ],
     * ...
     * 
     * @param $table
     * @param k
     * @param selector array for targetSelector, rowSelector, headerSelector, cellSelector
     * @param callback
     * 
     */

    this.export = function ($table, tableIndex, selector, callback) {
        this.table = {};

        var selectors;
        if (null != selector) {
            if (Array.isArray(selector))
                selectors = selector;
            else
                selectors = [selector];
        }
        else
            selectors = []

        var targetSelector = null, rowSelector = null, headerSelector = null, columnSelector = null, cellSelector = null;

        switch (selectors.length) {
            case 5:
                targetSelector = selectors[4];
            case 4:
                cellSelector = selectors[3];
            case 3:
                rowSelector = selectors[2];
            case 2:
                columnSelector = selectors[1];
            case 2:
                headerSelector = selectors[0];
            case 0:
                break;
        }

        var findHeaderSelector = null;

        if (columnSelector === null) {
            if (findHeaderSelector === 'tr')
                findHeaderSelector += ':has(' + ('th') + ')'; // 'tr:has(th)'
            else
                findHeaderSelector = (headerSelector || 'tr');
        }
        else {
            if (null !== headerSelector)
                findHeaderSelector += ':has(' + columnSelector + ')';
            else
                findHeaderSelector = columnSelector;
        }
        var $headers = null;
        $headers = $table.find(findHeaderSelector);

        var findRowsSelector = (rowSelector || 'tr') + ':has(' + (cellSelector || 'td') + ')'; // 'tr:has(td)'
        var $rows = $table.find(findRowsSelector);

        if (!$rows.length)
            return null;

        var headersMap = $headers.map(function(index, header) {
            return toColumn(index, header);
        });
        var headers = headersMap.get();
        var rows = this.exportRows($rows, cellSelector, targetSelector, callback);
        // [];
        // $rows.each((index, row) => {
        //     var colArray = toColumns(index, row, tableIndex, selector, callback);
        //     rows.push(colArray);
        // });

        if (headers.length > 0)
            this.table.headers = headers;

        this.table.rows = rows;
        
        return this.table;
    }

    /**
     * 
     */

    this.exportRows = function ($rows, cellSelector, targetSelector, callback) {
        var self = this;
        var rows = [];

        $rows.each(function(rowIndex, $row) {
            var ret = self.exportRow(rowIndex, $row, cellSelector, targetSelector, callback);
            rows.push(ret);
        });
        return rows;
    }

    /**
     * 
     */

    this.exportRow = function (rowIndex, row, cellSelector, targetSelector, callback) {
        cellSelector = cellSelector || 'td';

        var $cols = getQuery(row).find(cellSelector);

        var cols = [];

        $cols.each((colIndex, col) => {

            var obj;

            if (targetSelector && callback) {
                var $node = getQuery(targetSelector, col);
                if ($node.length > 0) {
                    obj = callback($, $node, colIndex, rowIndex);                   
                }
            }           
            
             var $text = toColumn(colIndex, col);

            if (obj) {
                obj.text = $text;
            }
            else {
                obj = $text;
            }

            cols.push(obj);
        });
        
        return cols;
    }

    this.generateCSV = function (table, cellDelim, rowDelim) {

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

    this.exportTableToCSV = function($table) {
        var $headers = $table.find('tr:has(th)')
            ,$rows = $table.find('tr:has(td)')


        // Grab text from table into CSV formatted string
        var csv = '"';
        csv += formatRows($headers.map(grabRow));
        csv += rowDelim;
        csv += formatRows($rows.map(grabRow)) + '"';

        // // Data URI
        // var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csv);

        // // For IE (tested 10+)
        // if (window.navigator.msSaveOrOpenBlob) {
        //     var blob = new Blob([decodeURIComponent(encodeURI(csv))], {
        //         type: "text/csv;charset=utf-8;"
        //     });
        //     navigator.msSaveBlob(blob, filename);
        // } else {
        //     $(this)
        //         .attr({
        //             'download': filename
        //             ,'href': csvData
        //             //,'target' : '_blank' //if you want it to open in a new window
        //     });
        // }
        return csv;
    }            
}

module.exports = TableExporter;