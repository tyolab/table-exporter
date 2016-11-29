    
/**
 * Code from: https://bl.ocks.org/kalebdf/ee7a5e7f44416b2116c0
 * 
 * Original Author: Adila Faruk
 */

function TableExporter ($)  {
    var
    // Temporary delimiter characters unlikely to be typed by keyboard
    // This is to avoid accidentally splitting the actual contents
    tmpColDelim = String.fromCharCode(11) // vertical tab character
    ,tmpRowDelim = String.fromCharCode(0) // null character


    // actual delimiter characters for CSV format
    ,colDelim = '","'
    ,rowDelim = '"\r\n"';

    //------------------------------------------------------------
    // Helper Functions 
    //------------------------------------------------------------
    // Format the output so it has the appropriate delimiters
    function formatRows(rows) {
        return rows.get().join(tmpRowDelim)
            .split(tmpRowDelim).join(rowDelim)
            .split(tmpColDelim).join(colDelim);
    }

    // Grab and format a row from the table
    function grabRow(i,row){
            
        var $row = $(row);
        //for some reason $cols = $row.find('td') || $row.find('th') won't work...
        var $cols = $row.find('td'); 
        if(!$cols.length) $cols = $row.find('th');  

        return $cols.map(grabCol)
                    .get().join(tmpColDelim);
    }

    // Grab and format a column from the table 
    function grabCol(j,col){
        var $col = $(col),
            $text = $col.text();

        return $text.replace('"', '""'); // escape double quotes

    }

    //------------------------------------------------------------
    // Helper Functions for JavaScript objects
    //------------------------------------------------------------

    // Grab and format a row from the table
    function toRowObj(i, row) {

        var $row = $(row);
        //for some reason $cols = $row.find('td') || $row.find('th') won't work...
        var $cols = $row.find('td'); 
        if(!$cols.length) $cols = $row.find('th');  

        var colArray = [];

        $cols.each((j, col) => {
            var $col = $(col),
                $text = $col.text();
            // var val = $text.replace('"', '""');
            colArray.push($text); // escape double quotes
        });
        return colArray; //[$cols.map(toColObj).get()];
    }

    // Grab and format a column from the table 
    function toColObj(j, col){
        var $col = $(col),
            $text = $col.text();

        return $text.replace('"', '""'); // escape double quotes

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
     * 
     */

    this.exportTableToJSON = function ($table) {
        var $headers = $table.find('tr:has(th)')
            ,$rows = $table.find('tr:has(td)');

        var table = {};

        var headers = $headers.map(toRowObj).get();
        var rows = [];
        $rows.each((i, row) => {
            var colArray = toRowObj(i, row);
            rows.push(colArray);
        });

        if (headers.length > 0)
            table.headers = headers;

        table.rows = rows;
        
        return table;
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