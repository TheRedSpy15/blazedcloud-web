<script lang="ts">
  import {
    convertSize,
    getFileName,
    getFolderName,
  } from "$lib/pocketbase/file_operations.js";
  import { fetchFileList } from "$lib/pocketbase/files_api.js";
  import { FileDropzone, getDrawerStore } from "@skeletonlabs/skeleton";
  import {
    IconCornerLeftUp,
    IconFile,
    IconFolder,
    IconFolderPlus,
    IconTrash,
  } from "@tabler/icons-svelte";
  import PocketBase from "pocketbase";

  const drawerStore = getDrawerStore();
  const pb = new PocketBase("https://pb.blazedcloud.com");

  export let data;
  $: ({ fileList, cookie, usage, capacity, path } = data);

  function gotoFolder(folderName: string = "") {
    pb.authStore.loadFromCookie(cookie ?? "");

    path += folderName;
    if (!path.endsWith("/")) path += "/";
    fetchFileList(pb.authStore.token, pb.authStore.model?.id, path)
      .then((data) => {
        console.log("Fetched data:", data);
        fileList = data;
      })
      .catch((err) => console.log(err));
  }

  function gotoParentFolder() {
    pb.authStore.loadFromCookie(cookie ?? "");

    path = path.substring(0, path.lastIndexOf("/", path.length - 2));
    if (!path.endsWith("/")) path += "/";
    if (path === "/") path = "";
    fetchFileList(pb.authStore.token, pb.authStore.model?.id, path)
      .then((data) => {
        console.log("Fetched data:", data);
        fileList = data;
      })
      .catch((err) => console.log(err));
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
        cookie: cookie,
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
        cookie: cookie,
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
        cookie: cookie,
      },
    });
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
<progress value={(Number(usage) / 1000000000).toFixed(2)} max={capacity} />

<FileDropzone name="files">
  <svelte:fragment slot="lead"
    ><i class="fa-solid fa-file-arrow-up text-4xl" /></svelte:fragment
  >
</FileDropzone>

<div class="table-container">
  <table class="table table-interactive">
    <thead>
      <tr>
        <th></th>
        <th>Name</th>
        <th>Size</th>
      </tr>
    </thead>
    <tbody>
      {#if path !== ""}
        <tr on:click={() => gotoParentFolder()}>
          <td><IconCornerLeftUp /></td>
          <td><b>Previous Folder</b></td>
          <td></td>
        </tr>

        <tr on:click={() => deleteFolder()}>
          <td><span class="text-red-500"><IconTrash /></span></td>
          <td><span class="text-red-500"><b>Delete Folder</b></span></td>
          <td></td>
        </tr>
      {/if}
      <tr on:click={() => folderCreator()}>
        <td><IconFolderPlus /></td>
        <td><b>Create Folder</b></td>
        <td></td>
      </tr>
      {#if fileList && fileList.CommonPrefixes}
        {#each fileList.CommonPrefixes as folder}
          <tr on:click={() => gotoFolder(getFolderName(folder.Prefix))}>
            <td><IconFolder /></td>
            <td><b>{getFolderName(folder.Prefix)}</b></td>
            <td></td>
          </tr>
        {/each}
      {/if}

      {#if fileList && fileList.Contents}
        {#each fileList.Contents as file}
          {#if !file.Key.includes(".blazed-placeholder")}
            <tr on:click={() => inspectFile(file)}>
              <td><IconFile /></td>
              <td>{getFileName(file.Key)}</td>
              <td>{convertSize(file.Size)}</td>
            </tr>
          {/if}
        {/each}
      {/if}
    </tbody>
    <tfoot>
      <tr>
        <th colspan="2">File Count</th>
        {#if fileList && fileList.Contents}
          {#if fileList.Prefix.split("/")[1] !== ""}
            <td>{fileList.Contents.length - 1}</td>
          {:else}
            <td>{fileList.Contents.length}</td>{/if}
        {:else}
          <td>0</td>
        {/if}
      </tr>
    </tfoot>
  </table>

  <div class="p-4">
    <p>📡 Connection - <span class="text-green-500">Secure (HTTPS)</span></p>
    <p>🔒 Files - <span class="text-green-500">Encrypted (AES-256)</span></p>
  </div>
</div>

<style>
</style>
