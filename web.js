var _te = _te || {};
var tyo_data = require('.');

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
            
                text = result.exporter.generate_csv(table, opts["cell-delim"], opts["row-delim"]);          
                    
                if (i === 1) {
                    outname = out_name + '.csv' /* + opts["output-type"] */;
                }
                else {
                    outname = out_name + i + '.csv' /* + opts["output-type"] */;
                }

                _te.download(text, outname, out_type);
            }
        }
        

    }
    else {
        console.error("No table found");
    }
}

window._te = _te;
window.tyo_data = tyo_data;
