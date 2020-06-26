/*
 *   Copyright (c) 2020 TYONLINE TECHNOLOGY PTY. LTD.
 *   All rights reserved.
 */
var _te = _te || {};
var tyo_data = require('.');

const table_util = require('./utils/table_util');

function get_table_selector ($temp, level) {
    var $table;

    if (level > 0 && $temp) {
        if ($temp && $temp.name && $temp.name === 'table') {
            $table = $temp;
        }
        else {
            $temp = $table.parent;
        }
    }
    return $table;
}

tyo_data.get_selected_text = function() {
    var text;
    var focused = document.activeElement;
    if (focused) {
        try {
        text = focused.value.substring(
            focused.selectionStart, focused.selectionEnd);
        } catch (err) {
        }
    }
    if (text == undefined) {
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type != "Control") {
            text = document.selection.createRange().text;
        }
    }
    return text;
}

tyo_data.export_selected = function(tableSelector, selectors, findProcessor) {
    if (!document.activeElement)
        return;
    // var text = tyo_data.get_selected_text();

    // if (!text && _te.selected_text)
    //     text = _te.selected_text;

    // if (text.length) {
        // var $elem = $('div:contains("' + text + '")');
        var $elem = $(document.activeElement);
        var $table;
        // var $temp;
        // go up to three levels, if can't not find <table>, we will just use $elem.parent as table selector
        if (tableSelector)
            $table = $($elem).closest(tableSelector);
        else {
            $table = $($elem).closest('table');
            // if ($table.parent && $table.parent.name && $table.parent.name === 'table') {
            //     $table = $table.parent;
            // }
            // else {
            //     $temp = $table.parent;

            //     if ($temp && $temp.name && $temp.name === 'table') {
            //         $table = $temp;
            //     }
            //     else {
            //         $temp = $table.parent;
        
            //         if ($temp && $temp.name && $temp.name === 'table') {
            //             $table = $temp;
            //         }
            //         else {
            //             //
            //         }
            //     }
            // }
        }

        if (!$table || !$table.length) {
            var $active = $elem;
            var text = tyo_data.get_selected_text();
            if (text.length) {
                var selector = (selectors["cell-selector"] || 'td') + ':contains("' + text + '")';
                $elem = $(selector);
                while (!$($elem).length && text.length > 5) {
                    text = text.substring(5);
                    $elem = $('div:contains("' + text + '")');
                }

                if (tableSelector)
                    $table = $($elem).closest(tableSelector);
                else 
                    $table = $($elem).closest('table');
            }
            
            if (!$table)
                $table = $active.parent;
        }

    return $table ? tyo_data.export($table, tableSelector, selectors, findProcessor) : null;
    // }
}

tyo_data.download = function(text, filename, filetype) {

    // For IE (tested 10+)
    if (window.navigator.msSaveOrOpenBlob) {
        var blob = new Blob([decodeURIComponent(encodeURI(text))], {
            type: "text/" + filetype + ";charset=utf-8;"
        });
        navigator.msSaveBlob(blob, filename);
    } else {
        // Data URI
        var textData = 'data:application/' + filetype + ';charset=utf-8,' + encodeURIComponent(text);
        var a = document.createElement('a');
        a.href = textData;
        a.download = filename;
        a.target = '_blank';
        a.click();
    }
}

tyo_data.save_table = function(table, opts) {
    opts = opts || {};
    var out_type = opts["output-type"] || "json";
    var out_name = opts["output-name"] || "data";

    var text;

    if (out_type === 'csv') {
        text = table_util.to_csv(table, opts["cell-delim"], opts["row-delim"]);          
                    
        outname = out_name + '.csv' 

        tyo_data.download(text, outname, out_type);
    }
    else {
        var out_file = out_name + ".json";
        text = JSON.stringify(table);
        tyo_data.download(text, out_file, out_type);
    }
}

tyo_data.save = function(result, opts) {
    if (result.tables && result.tables.length && result.tables.length > 0) {
        var writeFile = false;

        opts = opts || {};
        var out_type = opts["output-type"] || "json";
        var out_name = opts["output-name"] || "data";
    
        var text;

        if (out_type === 'json') {
            var out_file = out_name + ".json";
            text = JSON.stringify(result.tables);
            tyo_data.download(text, out_file, out_type);
        }
        else {
            var out_file = out_name + ".csv";
            // by default we only export csv file
            var i = 0;
            var outname;
            for (; i < result.tables.length; ++i) {
                var table = result.tables[i];
            
                text = table_util.table.generate_csv(table, opts["cell-delim"], opts["row-delim"]);          
                    
                if (i === 1) {
                    outname = out_name + '.csv' /* + opts["output-type"] */;
                }
                else {
                    outname = out_name + i + '.csv' /* + opts["output-type"] */;
                }

                tyo_data.download(text, outname, out_type);
            }
        }
        

    }
    else {
        console.error("No table found");
    }
}

tyo_data.helpers = table_util;

window._te = _te;
window.tyo_data = tyo_data;
