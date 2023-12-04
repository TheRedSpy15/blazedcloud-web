export function download(dataurl: string, filename: string) {
    console.log("download", dataurl, filename);
    const link = document.createElement("a");
    link.href = dataurl;
    link.download = filename;
    link.click();
}