
export async function fetchFileList(token: string, uid: string, prefix: string): Promise<any> {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("User-Agent", "blazed-portal");

    var formdata = new FormData();
    formdata.append("prefix", prefix);

    const reponse = await fetch(`https://pb.blazedcloud.com/data/v2/list/${uid}`, {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: formdata
    }).catch(error => console.error('error', error));

    if (reponse) {
        return reponse.json();
    } else {
        return {};
    }
}

export async function getDownloadUrl(uid: string, key: string, shlink: Boolean, token: string): Promise<string> {
    var myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        `Bearer ${token}`,
    );
    myHeaders.append("User-Agent", "blazed-portal");

    var formdata = new FormData();
    formdata.append("filename", key);
    formdata.append("useShlink", shlink ? "true" : "false");

    const response = await fetch(`https://pb.blazedcloud.com/data/down/${uid}`, {
        method: "POST",
        headers: myHeaders,
        body: formdata,
        redirect: "follow",
    });

    return response.text();
}

export async function getUsage(uid: string, token: string): Promise<string> {
    var myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        `Bearer ${token}`,
    );
    myHeaders.append("User-Agent", "blazed-portal");

    const response = await fetch(`https://pb.blazedcloud.com/data/usage/${uid}`, {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    });

    return response.text();
}

// creates placeholder file to create folder
export async function createFolder(folderKey: string, uid: string, token: string) {
    console.log("Creating folder: " + folderKey);
    getUploadUrl(folderKey + "/.blazed-placeholder", token, uid, "text/plain").then((url) => {
        console.log("Uploading to: " + url);
        var raw = "placeholder";
        fetch("/api/files/create-folder", { // use backend to proxy cors
            method: 'PUT',
            headers: {
                'content-type': 'application/json',
                'User-Agent': 'blazed-portal'
            },
            body: JSON.stringify({
                type: "text/plain",
                uploadUrl: url,
                bytes: raw,
                length: raw.length
            }),
            redirect: 'follow',
        }).then((response) => {
            console.log(response);

            if (response.ok) {
                console.log("Folder created!");
            }
        });
    });
}

export async function deleteFile(uid: string, key: any, token: string): Promise<Boolean> {
    try {
        console.log("Deleting file: " + key);
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            `Bearer ${token}`
        );
        myHeaders.append("User-Agent", "blazed-portal");

        var formdata = new FormData();
        formdata.append("fileKey", key);

        await fetch(`https://pb.blazedcloud.com/data/delete/${uid}/file`, {
            method: "DELETE",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        })
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error("error", error));
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}

export async function deleteFolder(uid: string, key: any, token: string): Promise<Boolean> {
    try {
        console.log("Deleting folder: " + key);
        var myHeaders = new Headers();
        myHeaders.append(
            "Authorization",
            `Bearer ${token}`
        );
        myHeaders.append("User-Agent", "blazed-portal");

        var formdata = new FormData();
        formdata.append("folderKey", key);

        await fetch(`https://pb.blazedcloud.com/data/delete/${uid}/folder`, {
            method: "DELETE",
            headers: myHeaders,
            body: formdata,
            redirect: "follow",
        })
            .then((response) => response.text())
            .then((result) => console.log(result))
            .catch((error) => console.error("error", error));
    } catch (err) {
        console.error(err);
        return false;
    }

    return true;
}

export async function getUploadUrl(filename: string, token: string, uid: string, type: string): Promise<string> {
    console.log("Getting upload url for: " + filename);
    console.log("Type: " + type);

    var myHeaders = new Headers();
    myHeaders.append(
        "Authorization",
        `Bearer ${token}`,
    );
    myHeaders.append("User-Agent", "blazed-portal");

    var formdata = new FormData();
    formdata.append("filename", filename);
    if (type !== "") formdata.append("contentType", type);
    formdata.append("contentLength", length.toString());


    const response = await fetch(`https://pb.blazedcloud.com/data/up/${uid}`, {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    });

    return response.text();
}


export async function uploadToUrl(url: string, file: File, type: string): Promise<Response> {
    const bodySize = file.size;

    var myHeaders = new Headers();
    if (type !== "") myHeaders.append("Content-Type", type);
    myHeaders.append("Content-Length", bodySize.toString());
    myHeaders.append("User-Agent", "blazed-portal");

    const response = await fetch(url, {
        method: 'PUT',
        headers: myHeaders,
        body: file,
        redirect: 'follow'
    }).then((response) => response);

    return response;
}
