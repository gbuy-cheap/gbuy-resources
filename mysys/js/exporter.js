var exporter = {
    DownloadAsExcel: function (jsonData, filename) {
        try {
            const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            const EXCEL_EXTENSION = '.xlsx';

            const worksheet = XLSX.utils.json_to_sheet(jsonData);
            const workbook = {
                Sheets: {
                    'data': worksheet
                },
                SheetNames: ['data']
            };
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

            const data = new Blob([excelBuffer], { type: EXCEL_TYPE });
            saveAs(data, filename + EXCEL_EXTENSION);
        } catch (error) {
            errorHandler.SendErrorToAdmin(error);
        }
    }
}