<script>
  import {
    Drawer,
    getDrawerStore,
    initializeStores,
    Toast,
  } from "@skeletonlabs/skeleton";
  import FileOptions from "./dashboard/files/[path]/fileOptions.svelte";
  import FolderCreator from "./dashboard/files/[path]/folderCreator.svelte";
  import FolderDeleter from "./dashboard/files/[path]/folderDeleter.svelte";

  initializeStores();
  const drawerStore = getDrawerStore();
</script>

<Toast />
<Drawer
  >{#if $drawerStore.id === "file-details"}
    <FileOptions
      file={$drawerStore.meta.file}
      cookie={$drawerStore.meta.cookie}
    />
  {:else if $drawerStore.id === "create-folder"}
    <FolderCreator
      path={$drawerStore.meta.path}
      cookie={$drawerStore.meta.cookie}
    />
  {:else if $drawerStore.id === "delete-folder"}
    <FolderDeleter
      path={$drawerStore.meta.path}
      cookie={$drawerStore.meta.cookie}
    />
  {/if}</Drawer
>
<slot />
