<script lang="ts">
  import { page } from "$app/stores";
  import {
    AppBar,
    AppRail,
    AppRailAnchor,
    AppShell,
    getDrawerStore,
    LightSwitch,
  } from "@skeletonlabs/skeleton";
  import {
    IconDevices,
    IconFiles,
    IconMenu2,
    IconUser,
  } from "@tabler/icons-svelte";
  import { onMount } from "svelte";
  import "../../app.postcss";

  const drawerStore = getDrawerStore();

  let isMobile = false;

  function checkMobile() {
    isMobile = window.innerWidth < 1024;
  }

  onMount(() => {
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  });

  function openDrawer() {
    drawerStore.open({
      id: "mobile-nav",
    });
  }
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <AppBar>
      <svelte:fragment slot="lead">
        {#if isMobile}
          <button
            class="btn btn-sm variant-ghost-surface mr-2"
            on:click={openDrawer}
          >
            <IconMenu2 />
          </button>
        {/if}
        <span
          class="bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone capitalize"
        >
          <strong class="text-xl uppercase">Blazed Cloud 🔥</strong>
        </span>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        {#if !isMobile}
          <button
            class="btn btn-sm variant-ghost-surface"
            on:click={() => (window.location.href = "/auth")}
          >
            Logout
          </button>
        {/if}
        <LightSwitch />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    {#if !isMobile}
      <AppRail>
        <AppRailAnchor
          href="/dashboard/files/root"
          data-sveltekit-prefetch
          selected={$page.url.pathname.startsWith("/dashboard/files")}
        >
          <svelte:fragment slot="lead"><IconFiles /></svelte:fragment>
          <span>Files</span>
        </AppRailAnchor>

        <AppRailAnchor
          href="/dashboard/account"
          data-sveltekit-prefetch
          selected={$page.url.pathname === "/dashboard/account"}
        >
          <svelte:fragment slot="lead"><IconUser /></svelte:fragment>
          <span>Account</span>
        </AppRailAnchor>

        <AppRailAnchor href="https://blazedcloud.com/start">
          <svelte:fragment slot="lead"><IconDevices /></svelte:fragment>
          <span>Apps</span>
        </AppRailAnchor>
      </AppRail>
    {/if}
  </svelte:fragment>

  <!-- Page Route Content -->
  <div class="container p-4 mx-auto">
    <slot />
  </div>
</AppShell>
