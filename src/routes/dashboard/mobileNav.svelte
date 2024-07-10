<script lang="ts">
  import { getDrawerStore } from "@skeletonlabs/skeleton";
  import { IconFiles, IconLogout, IconUser } from "@tabler/icons-svelte";
  import "../../app.postcss";

  const drawerStore = getDrawerStore();

  function closeDrawer() {
    drawerStore.close();
  }
</script>

<nav class="list-nav p-4">
  <ul>
    <li>
      <a
        href="/dashboard/files/root"
        on:click={closeDrawer}
        data-sveltekit-prefetch
      >
        <span class="flex items-center">
          <IconFiles class="mr-2" />
          Files
        </span>
      </a>
    </li>
    <li>
      <a
        href="/dashboard/account"
        on:click={closeDrawer}
        data-sveltekit-prefetch
      >
        <span class="flex items-center">
          <IconUser class="mr-2" />
          Account
        </span>
      </a>
    </li>
    <li>
      <a href="/auth" on:click={closeDrawer}>
        <span class="flex items-center">
          <IconLogout class="mr-2" />
          Logout
        </span>
      </a>
    </li>
  </ul>
</nav>
