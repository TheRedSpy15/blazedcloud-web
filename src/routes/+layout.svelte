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
  import MobileNav from "./dashboard/mobileNav.svelte";

  initializeStores();
  const drawerStore = getDrawerStore();
</script>

<Toast />
<Drawer
  >{#if $drawerStore.id === "file-details"}
    <FileOptions
      file={$drawerStore.meta.file}
      token={$drawerStore.meta.token}
      uid={$drawerStore.meta.uid}
    />
  {:else if $drawerStore.id === "create-folder"}
    <FolderCreator
      path={$drawerStore.meta.path}
      token={$drawerStore.meta.token}
      uid={$drawerStore.meta.uid}
    />
  {:else if $drawerStore.id === "delete-folder"}
    <FolderDeleter
      path={$drawerStore.meta.path}
      token={$drawerStore.meta.token}
      uid={$drawerStore.meta.uid}
    />
  {:else if $drawerStore.id === "mobile-nav"}
    <MobileNav />
  {/if}
</Drawer>
<slot />
