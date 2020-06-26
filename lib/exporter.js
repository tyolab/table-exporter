    
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

function TableExporter ($)  {

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
    function toColumns(rowIndex, row, tableIndex, cellSelector, targetSelector, selectorProcessor) {

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
            $text = $col.text().trim();

        return $text; // .replace('"', '""'); // escape double quotes not here, because it is text

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

    this.export = function ($table, tableIndex, tableSelector, selector, callback) {
        this.table = {};

        var targetSelector = null, rowSelector = null, headerSelector = null, headerRowSelector = null, cellSelector = null;
        var selectors;

        if (typeof selector === "function") {
            callback = selector;
            selector = null;
        }

        if (null != selector) {
            if (typeof selector === 'object' && !Array.isArray(selector)) {
                targetSelector = selector["target-selector"] || null;
                cellSelector = selector["cell-selector"] || null;
                headerSelector = selector["header-selector"] || null;
                rowSelector = selector["row-selector"] || null;
                headerRowSelector = selector["header-row-selector"] || null;
            }
            else {
                if (Array.isArray(selector))
                    selectors = selector;
                else
                    selectors = [selector];

                switch (selectors.length) {
                    case 5:
                        targetSelector = selectors[4];
                    case 4:
                        cellSelector = selectors[3];
                    case 3:
                        rowSelector = selectors[2];
                    case 2:
                        headerRowSelector = selectors[1];
                    case 2:
                        headerSelector = selectors[0];
                    case 0:
                        break;
                }
            }
        }

        var findHeaderSelector = null;

        if (headerRowSelector === null) {
            if (headerSelector === 'th')
                findHeaderSelector = (rowSelector || 'tr') + ':has(th)'; // 'tr:has(th)'
            else {
                headerSelector = headerSelector || 'th';
                findHeaderSelector = (rowSelector || 'tr') + ':has(' + headerSelector + ')'; // can't use tr alone as header selector
            }
        }
        else {
            headerSelector = headerSelector || 'th';
            findHeaderSelector = headerRowSelector + ':has(' + headerSelector + ')';
        }
        var $headerRow = null;
        if (findHeaderSelector) {
            $headerRow = $table.find(findHeaderSelector);
            if ($headerRow.length) {
                var $headers = $headerRow.find(headerSelector);
                
                var headersMap = $headers.map(function(index, header) {
                    return toColumn(index, header);
                });
                var headers = headersMap.get();
                if (headers.length > 0)
                    this.table.headers = headers;
            }
        }

        var findRowsSelector = (rowSelector || 'tr');
        if (cellSelector)
          findRowsSelector += ':has(' + cellSelector + ')'; 
        else if (findRowsSelector === 'tr')
            findRowsSelector += ':has(td)';
            
        var $rows = $table.find(findRowsSelector);

        if ($rows.length) {
            var rows = this.exportRows($rows, cellSelector, targetSelector, callback);
            this.table.rows = rows;
        }
        
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
}

module.exports = TableExporter;