/**
 * Export data
 */

Helper.export = (function () {

    const processRow = function (row) {
        let finalVal = "";
        for (let j = 0; j < row.length; j++) {
            let innerValue = row[j] == null ? "" : row[j].toLocaleString();

            // replace " and ;
            let result = innerValue.replace(/"/g, "\"\"").replace(";", ",");
            if (result.search(/("|,|\n)/g) >= 0) { result = "\"" + result + "\""; }
            if (j > 0) { finalVal += ","; }
            finalVal += result;
        }

        return finalVal + "\r\n";
    };


    function toCSV (filename, rows) {
        let csvFile = '';
        for (let i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        const blob = new Blob([csvFile], { type: "text/csv;charset=utf-8;" });
        const csvUrl = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.setAttribute("href", csvUrl);
        link.setAttribute("download", filename);
        link.style.visibility = "hidden";

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        toCSV: function (filename, rows) {
            toCSV(filename, rows);
        }
    };
}());
