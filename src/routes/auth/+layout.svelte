<script lang="ts">
  import {
    AppBar,
    AppShell,
    LightSwitch,
    Toast,
    initializeStores,
  } from "@skeletonlabs/skeleton";
  import "../../app.postcss";

  initializeStores();
</script>

<Toast />
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
          on:click={() =>
            (window.location.href =
              "https://github.com/TheRedSpy15/blazedcloud-web")}
        >
          <a href="https://github.com/TheRedSpy15/blazedcloud-web">GitHub</a>
        </button>
        <LightSwitch />
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <svelte:fragment slot="footer">
    <!-- App Bar -->
    <AppBar>
      <svelte:fragment slot="lead">
        <a href="https://blazedcloud.com">What is Blazed Cloud?</a>
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <!-- Page Route Content -->
  <slot />
</AppShell>
