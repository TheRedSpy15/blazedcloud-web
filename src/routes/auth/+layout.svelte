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
    <AppBar class="p-1" regionRowMain="w-0 h-0 lg:w-auto lg:h-auto">
      <svelte:fragment slot="lead">
        <a
          href="https://blazedcloud.com"
          class="invisible lg:visible w-0 lg:w-auto">What is Blazed Cloud?</a
        >
      </svelte:fragment>
      <svelte:fragment slot="headline">
        <a
          href="https://blazedcloud.com/privacy-policy/"
          class="lg:hidden text-sm h-4"
        >
          By logging you are agree to the use of cookies for authentication
        </a>
      </svelte:fragment>
      <svelte:fragment slot="trail">
        <a
          href="https://blazedcloud.com/privacy-policy/"
          class="invisible lg:visible w-0 lg:w-auto"
          >By logging you are agree to the use of cookies for authentication</a
        >
      </svelte:fragment>
    </AppBar>
  </svelte:fragment>

  <!-- Page Route Content -->
  <slot />
</AppShell>
