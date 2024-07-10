<script lang="ts">
  import { goto } from "$app/navigation";
  import {
    getFileName,
    getMimeTypeFromExtension,
  } from "$lib/pocketbase/file_operations";
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

  function isMediaFile(fileName: string): string | null {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (!extension) return null;

    const mimeType = getMimeTypeFromExtension(extension);
    if (
      mimeType.startsWith("image/") ||
      mimeType.startsWith("video/") ||
      mimeType.startsWith("audio/")
    ) {
      return mimeType;
    }
    return null;
  }

  let mediaUrl: string | null = null;
  let mediaType: string | null = null;

  $: {
    mediaType = isMediaFile(file.Key);
    if (mediaType) {
      getDownloadUrl(uid, file.Key, false, token).then((url) => {
        mediaUrl = url;
      });
    }
  }
</script>

<div class="file-options-container">
  <h6 class="h3 p-4">{getFileName(file.Key)}</h6>

  {#if mediaType && mediaUrl}
    <div class="media-preview">
      {#if mediaType.startsWith("image/")}
        <img src={mediaUrl} alt={getFileName(file.Key)} />
      {:else if mediaType.startsWith("video/")}
        <div class="video-container">
          <video src={mediaUrl} controls>
            Your browser does not support the video tag.
          </video>
        </div>
      {:else if mediaType.startsWith("audio/")}
        <audio src={mediaUrl} controls>
          Your browser does not support the audio tag.
        </audio>
      {/if}
    </div>
  {/if}

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
    <button
      type="button"
      class="btn variant-filled-error"
      on:click={optionDelete}>💣 Delete File</button
    >
  </div>
</div>

<style>
  .file-options-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .media-preview {
    max-width: 640px;
    max-height: 360px;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .media-preview img,
  .media-preview audio {
    max-width: 640px;
    max-height: 360px;
    object-fit: contain;
  }

  .video-container {
    max-width: 640px;
    max-height: 360px;
  }

  .video-container video {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
</style>
