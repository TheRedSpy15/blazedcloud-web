<script lang="ts">
  import Join from "./join.svelte";
  import Login from "./login.svelte";
  import Oauth from "./oauth.svelte";

  import { Tab, TabGroup } from "@skeletonlabs/skeleton";

  let tabSet: number = 0;
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-10 text-center flex flex-col items-center">
    <h2 class="h2">🔒 Cool kids only.</h2>
    <TabGroup justify="justify-center">
      <Tab bind:group={tabSet} name="login" value={0}>
        <span>Login</span>
      </Tab>
      <Tab bind:group={tabSet} name="join" value={1}>Join</Tab>
      <Tab bind:group={tabSet} name="oauth" value={2}>Oauth</Tab>
      <!-- Tab Panels --->
      <svelte:fragment slot="panel">
        {#if tabSet === 0}
          <Login />
        {:else if tabSet === 1}
          <Join />
        {:else if tabSet === 2}
          <Oauth />
        {/if}
      </svelte:fragment>
    </TabGroup>
    <a
      href="/auth/forgot"
      data-sveltekit-prefetch
      class="text-sm text-gray-500 hover:underline"
    >
      Forgot your password?
    </a>
  </div>
</div>

<style>
</style>
