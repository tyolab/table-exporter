# table-exporter

Export HTML Table (Table Tag, Table CSS) to a file (JSON, CSV, etc.)

## Usage

```javascript
node bin/export_table table.html 
```

## Examples

### 

```javascript

var exporter = require('table-exporter');

/**
 *  exporter = function (html, tableSelector, findSelector, callback)
 */
 var html = `<html>
                <body>
                    <table>
                        <tr>
                            <th>Column One</th>
                            <th>Column Two</th>
                            <th>Column Three</th>
                        </tr>
                        <tr>
                            <td>Row 1 Col 1</td>
                            <td>Row 1 Col 2</td>
                            <td>Row 1 Col 3 </td>
                        </tr>
                        <tr>
                            <td>Row 2 Col 1</td>
                            <td>Row 2 Col 2</td>
                            <td>Row 2 Col 3</td>
                        </tr>
                        <tr>
                            <td>Row 3 Col 1</td>
                            <td>Row 3 Col 2</td>
                            <td>Row 3 Col 3</td>
                        </tr>
                    </table>
                </body>
                </html>`

 var tables = exporter.export(html);

// output is an array of table that are found
// for example
// tables === [{"headers":["Column One","Column Two","Column Three"],"rows":[["Row 1 Col 1","Row 1 Col 2","Row 1 Col 3 "],["Row 2 Col 1","Row 2 Col 2","Row 2 Col 3"],["Row 3 Col 1","Row 3 Col 2","Row 3 Col 3"]]}]

```

## Use in a brower

### Install Browserify

```bash
npm install --global browserify
```

### Produce Table Exporter Javascript Bundle

```javascript
browserify index.js -o te.js
```

```html
<!DOCTYPE>
<html>
    <head>
    <script src="../te.js"></script>
    </head>
    <body>
    </body>
</html>
```

## Maintainer

[Eric Tang](https://twitter.com/_e_tang) @ [TYO LAB](http://tyo.com.au)

