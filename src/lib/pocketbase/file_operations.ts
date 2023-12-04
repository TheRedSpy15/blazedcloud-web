
export function getFileName(url: string): string {
    return url.split('/').pop() ?? '';
}

export function getFolderName(url: string): string {
    return url.split('/').slice(-2)[0];
}

export function removeUidFromPath(url: string): string {
    return url.split('/').slice(1).join('/');
}

export function convertSize(size: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let unitIndex = 0;
    while (size > 1024) {
        size /= 1024;
        unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
}

// TODO replace with library
export function getMimeTypeFromExtension(extension: string): string {
    switch (extension) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        case 'mp4':
            return 'video/mp4';
        case 'webm':
            return 'video/webm';
        case 'mp3':
            return 'audio/mpeg';
        case 'wav':
            return 'audio/wav';
        case 'ogg':
            return 'audio/ogg';
        case 'pdf':
            return 'application/pdf';
        case 'txt':
            return 'text/plain';
        case 'html':
            return 'text/html';
        case 'css':
            return 'text/css';
        case 'js':
            return 'application/javascript';
        case 'json':
            return 'application/json';
        case 'xml':
            return 'application/xml';
        case 'zip':
            return 'application/zip';
        case '7z':
            return 'application/x-7z-compressed';
        case 'rar':
            return 'application/vnd.rar';
        case 'tar':
            return 'application/x-tar';
        case 'gz':
            return 'application/gzip';
        case 'exe':
            return 'application/x-msdownload';
        case 'apk':
            return 'application/vnd.android.package-archive';
        case 'iso':
            return 'application/x-iso9660-image';
        case 'img':
            return 'application/octet-stream';
        case 'bin':
            return 'application/octet-stream';
        case 'md':
            return 'text/markdown';
        case 'csv':
            return 'text/csv';
        case 'xls':
            return 'application/vnd.ms-excel';
        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'ppt':
            return 'application/vnd.ms-powerpoint';
        case 'pptx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case 'doc':
            return 'application/msword';
        case 'docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'svg':
            return 'image/svg+xml';
        case 'ico':
            return 'image/vnd.microsoft.icon';
        case 'cur':
            return 'image/vnd.microsoft.icon';
        case 'ttf':
            return 'font/ttf';
        case 'woff':
            return 'font/woff';
        case 'woff2':
            return 'font/woff2';
        case 'otf':
            return 'font/otf';
        case 'eot':
            return 'application/vnd.ms-fontobject';
        case 'sfnt':
            return 'application/font-sfnt';
        case 'psd':
            return 'image/vnd.adobe.photoshop';
        case 'ai':
        case 'eps':
        case 'ps':
            return 'application/postscript';
        case 'indd':
            return 'application/x-indesign';
        case 'dwg':
            return 'application/acad';
        case 'flac':
            return 'audio/flac';
        case 'm4a':
            return 'audio/m4a';
        case 'm4p':
            return 'audio/m4p';
        case 'm4b':
            return 'audio/m4b';
        case 'm4r':
            return 'audio/m4r';
        case 'aac':
            return 'audio/aac';
        case 'opus':
            return 'audio/opus';
        case 'weba':
            return 'audio/webm';
        case 'oga':
            return 'audio/ogg';
        case 'srt':
            return 'application/x-subrip';
        case 'vtt':
            return 'text/vtt';
        case 'webp':
            return 'image/webp';
        case 'avif':
            return 'image/avif';
        case 'bmp':
            return 'image/bmp';
        case 'tiff':
            return 'image/tiff';
        case 'tif':
            return 'image/tiff';
        case 'heif':
            return 'image/heif';
        case 'heic':
            return 'image/heic';
        case 'jxr':
            return 'image/vnd.ms-photo';
        default:
            return 'application/octet-stream';
    }
}