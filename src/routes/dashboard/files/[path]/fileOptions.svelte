<script lang="ts">
  import { goto } from "$app/navigation";
  import { getFileName } from "$lib/pocketbase/file_operations";
  import { deleteFile, getDownloadUrl } from "$lib/pocketbase/files_api";
  import { download } from "$lib/utils";
  import {
    getDrawerStore,
    getToastStore,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";

  export let file = { Key: "" };
  export let uid: string;
  export let token: string;

  const toastStore = getToastStore();
  const drawerStore = getDrawerStore();

  async function optionDelete() {
    try {
      const fileFolder = file.Key.substring(0, file.Key.lastIndexOf("/"));
      deleteFile(uid, file.Key, token).then(async (result) => {
        if (result === false) throw new Error("Failed to delete file");
        console.log(result);

        const t: ToastSettings = {
          message: "File deleted successfully",
          background: "variant-filled-success",
        };
        toastStore.trigger(t);
        await goto("/dashboard/files/" + encodeURIComponent(fileFolder));
      });
    } catch (err) {
      console.error(err);
      const t: ToastSettings = {
        message: "Failed to delete file",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    }
    drawerStore.close();
  }

  async function optionDownload() {
    try {
      getDownloadUrl(uid, file.Key, false, token).then((result) => {
        if (result === "") throw new Error("Failed to get download URL");

        console.log(result);
        download(result, getFileName(file.Key));
      });
    } catch (err) {
      console.error(err);
      const t: ToastSettings = {
        message: "Failed to delete file",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    }
    drawerStore.close();
  }

  let copied = false;

  function onCopyClicked() {
    getDownloadUrl(uid, file.Key, true, token).then((shlinkUrl) => {
      navigator.clipboard.writeText(shlinkUrl);
      copied = true;
      setTimeout(() => {
        copied = false;
      }, 1000);
    });
  }
</script>

<h6 class="h3 p-4">{getFileName(file.Key)}</h6>
<div class="flex flex-col space-y-2 p-6">
  <button
    on:click={onCopyClicked}
    type="button"
    class="btn variant-filled-surface"
    >{copied ? "Copied 👍" : "📋 Copy Share URL"}</button
  >
  <button
    type="button"
    class="btn variant-filled-surface"
    on:click={optionDownload}>💾 Download File</button
  >
  <button type="button" class="btn variant-filled-error" on:click={optionDelete}
    >💣 Delete File</button
  >
</div>
