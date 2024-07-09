<script lang="ts">
  import { enhance } from "$app/forms";
  import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
  import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-svelte";
  import PocketBase from "pocketbase";
  import { onMount } from "svelte";

  const toastStore = getToastStore();

  const pb = new PocketBase("https://pb.blazedcloud.com");

  let oauthProviders: string[] = [];
  let loading: boolean = false;

  onMount(async () => {
    try {
      const authMethods = await pb.collection("users").listAuthMethods();
      oauthProviders = authMethods.authProviders.map(
        (provider) => provider.name,
      );
    } catch (error) {
      console.error("Failed to fetch OAuth providers:", error);
    }
  });

  async function login(form: HTMLFormElement) {
    try {
      await pb
        .collection("users")
        .authWithPassword(form.email.value, form.password.value);
      form.token.value = pb.authStore.token;
      form.submit();

      const t: ToastSettings = {
        message: "Loading your dashboard...",
        background: "variant-filled-success",
      };
      toastStore.trigger(t);
    } catch (err) {
      console.error(err);
      const t: ToastSettings = {
        message: "Login failed.",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    }
  }

  async function oauthLogin(provider: string) {
    try {
      loading = true;
      const authData = await pb
        .collection("users")
        .authWithOAuth2({ provider });

      // If successful, submit the form with the token
      const form = document.createElement("form");
      form.method = "post";
      const tokenInput = document.createElement("input");
      tokenInput.type = "hidden";
      tokenInput.name = "token";
      tokenInput.value = pb.authStore.token;
      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();

      const t: ToastSettings = {
        message: "Loading your dashboard...",
        background: "variant-filled-success",
      };
      toastStore.trigger(t);
    } catch (err) {
      console.error(err);
      const t: ToastSettings = {
        message: `${provider} login failed.`,
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    } finally {
      loading = false;
    }
  }

  function getProviderIcon(provider: string) {
    switch (provider.toLowerCase()) {
      case "github":
        return IconBrandGithub;
      case "google":
        return IconBrandGoogle;
      default:
        return null;
    }
  }
</script>

<form
  method="post"
  class="space-y-4"
  use:enhance={() => {
    return async ({ result }) => {
      if (result) {
        loading = false;
      }
    };
  }}
  on:submit|preventDefault={(e) => login(e.currentTarget)}
>
  <input name="token" type="hidden" />
  <input
    type="email"
    id="email"
    class="input input-primary input-bordered"
    placeholder="Email"
  />
  <input
    type="password"
    id="password"
    class="input input-primary input-bordered"
    placeholder="Password"
  />
  <button disabled={loading} class="btn variant-filled-primary">Login</button>
</form>

{#if oauthProviders.length > 0}
  <div class="mt-6">
    <div class="text-center text-sm text-gray-500 mb-4">Or continue with</div>
    <div class="flex justify-center space-x-4">
      {#each oauthProviders as provider}
        <button
          on:click={() => oauthLogin(provider)}
          disabled={loading}
          class="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label={`Sign in with ${provider}`}
        >
          <svelte:component
            this={getProviderIcon(provider)}
            class="h-8 w-8 text-gray-600 hover:text-gray-800"
          />
        </button>
      {/each}
    </div>
  </div>
{/if}

<style>
</style>
