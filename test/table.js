
const fs = require('fs');

const path = require('path');

const table_util = require('../utils/table_util');

var data_file = path.resolve(__dirname, 'table.json');

var data_buffer = fs.readFileSync(data_file, 'utf8');

var data_table = JSON.parse(data_buffer);

/**
 * Make <table></table> style table
 */
var html_table = table_util.to_html_table(data_table.headers, data_table.rows);

console.log("<html><head>\n");

console.log("</head><body>\n");

console.log(html_table);

console.log("\n");

console.log("</body></html>");