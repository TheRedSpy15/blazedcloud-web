<script lang="ts">
  import { beforeNavigate } from "$app/navigation";
  import {
    convertSize,
    getFileName,
    getFolderName,
  } from "$lib/pocketbase/file_operations.js";
  import {
    fetchFileList,
    getUploadUrl,
    getUsage,
  } from "$lib/pocketbase/files_api.js";
  import {
    FileDropzone,
    ProgressBar,
    getDrawerStore,
  } from "@skeletonlabs/skeleton";
  import {
    IconCornerLeftUp,
    IconFile,
    IconFileCode,
    IconFileDescription,
    IconFileMusic,
    IconFileSpreadsheet,
    IconFileText,
    IconFileZip,
    IconFolder,
    IconFolderPlus,
    IconPhoto,
    IconTrash,
    IconVideo,
  } from "@tabler/icons-svelte";
  import axios from "axios";

  class Upload {
    fileKey: string;
    progress: number;
    isUploading: Boolean = true;
    constructor(fileKey: string) {
      this.fileKey = fileKey;
      this.progress = 0;
      this.isUploading = true;
    }
  }

  let tmpUpload: FileList; // used only for the Dropzone on:change event
  let uploads: Upload[] = []; // used to store state of uploads, format { "fileKey": key, "progress": 0, "state": "uploading" }
  $: activeUploads = uploads.filter((upload) => upload.isUploading === true);
  beforeNavigate(({ cancel }) => {
    if (activeUploads.length > 0) {
      if (
        !confirm(
          "You have active uploads. Are you sure you want to leave this page?\n\nPartially uploaded files will be corrupted, and will need to be reuploaded.",
        )
      ) {
        cancel();
      }
    }
  });

  const drawerStore = getDrawerStore();

  export let data;
  $: ({ fileList, usage, capacity, path, uid, token } = data);

  let searchTerm = "";

  function filterFiles(files: any[], term: string) {
    if (!term.trim()) return files;
    return files.filter((file) =>
      getFileName(file.Key).toLowerCase().includes(term.toLowerCase()),
    );
  }

  let sortColumn = "Name";
  let sortDirection = "asc";

  function sortFiles(files: any[], column: string, direction: string) {
    return [...files].sort((a, b) => {
      let aValue, bValue;
      if (column === "Name") {
        aValue = getFileName(a.Key).toLowerCase();
        bValue = getFileName(b.Key).toLowerCase();
      } else if (column === "Size") {
        aValue = a.Size;
        bValue = b.Size;
      } else if (column === "Date") {
        aValue = new Date(a.LastModified);
        bValue = new Date(b.LastModified);
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  function calculateTotalSize(files: any[]): number {
    return files.reduce((total, file) => total + file.Size, 0);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return date.toLocaleString(); // You can customize this format as needed
  }

  function toggleSort(column: string) {
    if (sortColumn === column) {
      sortDirection = sortDirection === "asc" ? "desc" : "asc";
    } else {
      sortColumn = column;
      sortDirection = "asc";
    }
  }

  function gotoFolder(folderName: string = "") {
    console.log("Token:", token);
    console.log("Model:", uid);

    path += folderName;
    if (!path.endsWith("/")) path += "/";
    fetchFileList(token, uid, path)
      .then((data) => {
        console.log("Fetched data:", data);
        fileList = data;
      })
      .catch((err) => console.error(err));

    getUsage(uid, token).then((data) => {
      usage = data;
    });
  }

  function gotoParentFolder() {
    path = path.substring(0, path.lastIndexOf("/", path.length - 2));
    if (!path.endsWith("/")) path += "/";
    if (path === "/") path = "";
    fetchFileList(token, uid, path)
      .then((data) => {
        console.log("Fetched data:", data);
        fileList = data;
      })
      .catch((err) => console.error(err));

    getUsage(uid, token).then((data) => {
      usage = data;
    });
  }

  function reloadList() {
    fetchFileList(token, uid, path)
      .then((data) => {
        fileList = data;
      })
      .catch((err) => console.error(err));

    getUsage(uid, token).then((data) => {
      usage = data;
    });
  }

  function deleteFolder() {
    drawerStore.open({
      id: "delete-folder",
      bgBackdrop:
        "bg-gradient-to-tr from-yellow-500/50 via-red-500/50 to-orange-500/50",
      padding: "p-4",
      rounded: "rounded-xl",
      position: "bottom",
      height: "h-auto",
      meta: {
        path: path,
        token: token,
        uid: uid,
      },
    });
  }

  function inspectFile(file: any) {
    drawerStore.open({
      id: "file-details",
      bgBackdrop:
        "bg-gradient-to-tr from-yellow-500/50 via-red-500/50 to-orange-500/50",
      padding: "p-4",
      rounded: "rounded-xl",
      position: "bottom",
      height: "h-auto",
      meta: {
        file: file,
        token: token,
        uid: uid,
      },
    });
  }

  function folderCreator() {
    drawerStore.open({
      id: "create-folder",
      bgBackdrop:
        "bg-gradient-to-tr from-yellow-500/50 via-red-500/50 to-orange-500/50",
      padding: "p-4",
      rounded: "rounded-xl",
      position: "bottom",
      height: "h-auto",
      meta: {
        path: path,
        token: token,
        uid: uid,
      },
    });
  }

  function getFileIcon(fileName: string) {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "txt":
      case "md":
      case "rtf":
        return IconFileText;
      case "xls":
      case "xlsx":
      case "csv":
        return IconFileSpreadsheet;
      case "zip":
      case "rar":
      case "7z":
        return IconFileZip;
      case "mp3":
      case "wav":
      case "ogg":
        return IconFileMusic;
      case "mp4":
      case "avi":
      case "mov":
        return IconVideo;
      case "js":
      case "py":
      case "java":
      case "cpp":
      case "html":
      case "css":
        return IconFileCode;
      case "pdf":
        return IconFileDescription;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "bmp":
        return IconPhoto;
      default:
        return IconFile;
    }
  }
</script>

{#if path === ""}
  <h1 class="h1 p-4">📂 Your Files</h1>
{:else}
  <h1 class="h1 p-4">📂 {path}</h1>
{/if}

<p>
  Storage usage: {(Number(usage) / 1000000000).toFixed(2)}/{capacity} GB
</p>
<ProgressBar
  value={Number((Number(usage) / 1000000000).toFixed(2))}
  max={capacity}
  meter="bg-primary-500"
/>

{#if activeUploads.length > 0}
  <aside class="alert variant-filled-surface mt-4">
    <div class="alert-message">
      <h3 class="h3">Uploading {activeUploads.length} Files</h3>
      <div>
        {#each activeUploads as upload}
          <p>{upload.progress}% {getFileName(upload.fileKey)}</p>
        {/each}
      </div>
    </div>
  </aside>
{/if}

<FileDropzone
  class="mt-4"
  name="files"
  multiple
  bind:files={tmpUpload}
  on:change={(_) => {
    Array.from(tmpUpload).forEach((file) => {
      uploads = [...uploads, new Upload(path + file.name)];

      const key = path + file.name;
      getUploadUrl(key, token, uid, file.type).then((url) => {
        axios
          .put(url, file, {
            headers: {
              "Content-Type": file.type,
              "User-Agent": "blazed-portal",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / (progressEvent.total ?? 0),
              );
              const upload = uploads.find((upload) => upload.fileKey === key);
              if (upload) {
                upload.progress = percentCompleted;
              }
              uploads = [...uploads];
            },
          })
          .then((res) => {
            console.log("Upload response:", res);
            const upload = uploads.find((upload) => upload.fileKey === key);
            if (upload) {
              upload.isUploading = false;
              reloadList();
            }
            reloadList();
            uploads = [...uploads];
          })
          .catch((err) => {
            const upload = uploads.find((upload) => upload.fileKey === key);
            if (upload) {
              upload.isUploading = false;
            }
            console.error("Upload error:", err);
            uploads = [...uploads];
          });
      });
    });
  }}
/>

<div class="search-container mb-4 mt-4">
  <input
    type="text"
    placeholder="Search files..."
    bind:value={searchTerm}
    class="input"
  />
</div>

<div class="table-container">
  <div class="file-stats mb-4">
    <p>
      Folder Size: {convertSize(calculateTotalSize(fileList?.Contents || []))}
    </p>
    <p>
      Files:
      {#if fileList && fileList.Contents}
        {fileList.Prefix.split("/")[1] !== ""
          ? fileList.Contents.length - 1
          : fileList.Contents.length}
      {:else}
        0
      {/if}
    </p>
  </div>
  <table class="table table-interactive">
    <thead>
      <tr>
        <th></th>
        <th on:click={() => toggleSort("Name")}>
          Name {sortColumn === "Name"
            ? sortDirection === "asc"
              ? "▲"
              : "▼"
            : ""}
        </th>
        <th on:click={() => toggleSort("Size")}>
          Size {sortColumn === "Size"
            ? sortDirection === "asc"
              ? "▲"
              : "▼"
            : ""}
        </th>
        <th on:click={() => toggleSort("Date")}>
          Date {sortColumn === "Date"
            ? sortDirection === "asc"
              ? "▲"
              : "▼"
            : ""}
        </th>
      </tr>
    </thead>
    <tbody>
      {#if path !== ""}
        <tr on:click={() => gotoParentFolder()}>
          <td><IconCornerLeftUp /></td>
          <td><b>Previous Folder</b></td>
          <td></td>
          <td></td>
        </tr>

        <tr on:click={() => deleteFolder()}>
          <td><span class="text-red-500"><IconTrash /></span></td>
          <td><span class="text-red-500"><b>Delete Folder</b></span></td>
          <td></td>
          <td></td>
        </tr>
      {/if}
      <tr on:click={() => folderCreator()}>
        <td><IconFolderPlus class="text-primary-500" /></td>
        <td><b class="text-primary-500">Create Folder</b></td>
        <td></td>
        <td></td>
      </tr>
      {#if fileList && fileList.CommonPrefixes}
        {#each fileList.CommonPrefixes as folder}
          <tr on:click={() => gotoFolder(getFolderName(folder.Prefix))}>
            <td><IconFolder /></td>
            <td><b>{getFolderName(folder.Prefix)}</b></td>
            <td></td>
            <td></td>
          </tr>
        {/each}
      {/if}

      {#if fileList && fileList.Contents}
        {#each sortFiles(filterFiles(fileList.Contents, searchTerm), sortColumn, sortDirection) as file}
          {#if !file.Key.includes(".blazed-placeholder")}
            <tr on:click={() => inspectFile(file)}>
              <td>
                <svelte:component this={getFileIcon(getFileName(file.Key))} />
              </td>
              <td>{getFileName(file.Key)}</td>
              <td>{convertSize(file.Size)}</td>
              <td>{formatDate(file.LastModified)}</td>
            </tr>
          {/if}
        {/each}
      {/if}
    </tbody>
  </table>

  <div class="p-4">
    <p>📡 Connection - <span class="text-green-500">Secure (HTTPS)</span></p>
    <p>🔒 Files - <span class="text-green-500">Encrypted (AES-256)</span></p>
  </div>
</div>

<style>
  th {
    cursor: pointer;
    user-select: none;
  }

  th:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  .file-stats {
    display: flex;
    flex-direction: column;
    font-weight: bold;
  }

  .file-stats p {
    margin-bottom: 0.5rem;
  }
</style>
