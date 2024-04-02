<script lang="ts">
  import { goto } from "$app/navigation";
  import { createFolder } from "$lib/pocketbase/files_api";
  import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";

  export let path = "";
  export let token: string;
  export let uid: string;
  let folderName: string;

  const toastStore = getToastStore();

  async function optionCreate() {
    try {
      const folderKey = path === "" ? folderName : `${path}${folderName}`;

      await createFolder(folderKey, uid, token);
      const t: ToastSettings = {
        message: "Folder created successfully",
        background: "variant-filled-success",
      };
      toastStore.trigger(t);
      await goto(`/dashboard/files/${encodeURIComponent(folderKey)}/`);
    } catch (err) {
      console.error(err);
      const t: ToastSettings = {
        message: "Failed to create folder",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    }
  }
</script>

<h6 class="h3 pl-4 pt-4">Create New Folder</h6>
{#if path !== ""}
  <p class="pl-4">Will be placed at: {path}</p>
{/if}
<div class="flex flex-col space-y-2 p-6">
  <input
    type="text"
    id="folderName"
    class="input input-primary input-bordered"
    placeholder="Folder Name"
    bind:value={folderName}
  />
  <button
    type="button"
    class="btn variant-filled-primary"
    on:click={optionCreate}>Create Folder</button
  >
</div>
