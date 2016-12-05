# table-exporter

Export HTML Table (Table Tag, Table CSS) to a file (JSON, CSV, etc.)

# usage

```javascript

var exportTable = require('table-exporter');

/**
 *  exportTable = function (html, tableSelector, findSelector, callback)
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

 var obj = exportTable(html);

// an object with "tables" and "links" will be returned

// obj.tables === [{"headers":["Column One","Column Two","Column Three"],"rows":[["Row 1 Col 1","Row 1 Col 2","Row 1 Col 3 "],["Row 2 Col 1","Row 2 Col 2","Row 2 Col 3"],["Row 3 Col 1","Row 3 Col 2","Row 3 Col 3"]]}]
// obj.links === []
```



# maintainer

@tyolab

