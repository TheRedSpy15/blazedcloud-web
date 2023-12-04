<script lang="ts">
  import { goto } from "$app/navigation";
  import { deleteFolder } from "$lib/pocketbase/files_api";
  import {
    getDrawerStore,
    getToastStore,
    type ToastSettings,
  } from "@skeletonlabs/skeleton";
  import PocketBase from "pocketbase";

  export let path = "";
  export let cookie: string;

  const pb = new PocketBase("https://pb.blazedcloud.com");
  const toastStore = getToastStore();
  const drawerStore = getDrawerStore();

  async function optionDelete() {
    try {
      pb.authStore.loadFromCookie(cookie);

      var parentFolder = path.substring(
        0,
        path.lastIndexOf("/", path.length - 2),
      );
      if (parentFolder === "") parentFolder = "root";
      deleteFolder(pb.authStore.model?.id, path, pb.authStore.token).then(
        async (result) => {
          if (result === false) throw new Error("Failed to delete file");
          console.log(result);

          const t: ToastSettings = {
            message: "Folder deleted successfully",
            background: "variant-filled-success",
          };
          toastStore.trigger(t);
          console.log(
            "Folder deleted successfully - going to: " + parentFolder,
          );
          await goto("/dashboard/files/" + encodeURIComponent(parentFolder));
        },
      );
    } catch (err) {
      console.error(err);
      const t: ToastSettings = {
        message: "Failed to delete folder",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    }
    drawerStore.close();
  }
</script>

<h6 class="h3 pl-4 pt-4">Delete Folder?</h6>
{#if path !== ""}
  <p class="pl-4">Deleting: {path}</p>
{/if}
<div class="flex flex-col space-y-2 p-6">
  <button
    type="button"
    class="btn variant-filled-surface"
    on:click={() => drawerStore.close()}>Cancel</button
  >
  <button type="button" class="btn variant-filled-error" on:click={optionDelete}
    >Delete Folder</button
  >
</div>
