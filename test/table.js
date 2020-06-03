
const fs = require('fs');

const path = require('path');

const Table = require('../lib/table');
const table_util = new Table();

var data_file = path.resolve(__dirname, 'test.json');

var data_buffer = fs.readFileSync('test.json', 'utf8');

var data_table = JSON.parse(data_buffer);

