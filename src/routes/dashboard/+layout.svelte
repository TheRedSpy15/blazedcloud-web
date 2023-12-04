<script lang="ts">
  import {
    AppBar,
    AppRail,
    AppRailAnchor,
    AppShell,
    LightSwitch,
  } from "@skeletonlabs/skeleton";
  import "../../app.postcss";
  // Floating UI for Popups
  import { page } from "$app/stores";
  import { IconFiles, IconUser } from "@tabler/icons-svelte";

  let currentTile: number = 0;
</script>

<!-- App Shell -->
<AppShell>
  <svelte:fragment slot="header">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <span
          class="bg-gradient-to-br from-red-500 to-yellow-500 bg-clip-text text-transparent box-decoration-clone capitalize"
        >
          <strong class="text-xl uppercase">Blazed Cloud 🔥</strong>
        </span>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <button
          class="btn btn-sm variant-ghost-surface"
          on:click={() => (window.location.href = "/auth")}
        >
          Logout
        </button>
        <LightSwitch />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="sidebarLeft">
    <!-- Hidden below Tailwind's large breakpoint -->
    <AppRail>
      <AppRailAnchor
        bind:group={currentTile}
        name="tile-files"
        value={0}
        title="tile-files"
        href="/dashboard/files/root"
        data-sveltekit-prefetch
        selected={$page.url.pathname.startsWith("/dashboard/files")}
      >
        <svelte:fragment slot="lead"
          ><i class="fa-solid fa-image text-2xl"><IconFiles /></i
          ></svelte:fragment
        >
        <span>Files</span>
      </AppRailAnchor>
      <AppRailAnchor
        bind:group={currentTile}
        name="tile-account"
        value={1}
        title="tile-account"
        href="/dashboard/account"
        data-sveltekit-prefetch
        selected={$page.url.pathname === "/dashboard/account"}
      >
        <svelte:fragment slot="lead"
          ><i class="fa-solid fa-image text-2xl"><IconUser /></i
          ></svelte:fragment
        >
        <span>Account</span>
      </AppRailAnchor>
    </AppRail>
  </svelte:fragment>

  <!-- Page Route Content -->
  <div class="container p-10 mx-auto">
    <slot />
  </div>
</AppShell>
