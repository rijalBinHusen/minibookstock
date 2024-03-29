export const startExport = async (records, fileName) => {
    // the records parameter can contain object, array, any string
    // create a download file
    var a = window.document.createElement("a");
    // new blob data
    var file = new Blob([JSON.stringify(records)], { type: "text/plain" });
    // append file
    a.href = URL.createObjectURL(file);
    // file name
    a.download = fileName;
    //  click download link
    a.click();
    return
}