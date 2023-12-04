<script lang="ts">
  import { enhance } from "$app/forms";
  import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
  import { IconBrandGithub } from "@tabler/icons-svelte";
  import PocketBase from "pocketbase";

  const toastStore = getToastStore();

  const pb = new PocketBase("https://pb.blazedcloud.com");

  async function loginWithOauth(form: HTMLFormElement) {
    try {
      await pb.collection("users").authWithOAuth2({ provider: "github" });
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
        message: "Failed to login with GitHub. Please try again later.",
        background: "variant-filled-error",
      };
      toastStore.trigger(t);
    }
  }

  let loading: boolean = false;
</script>

<form
  method="post"
  use:enhance={() => {
    return async ({ result }) => {
      if (result) {
        loading = false;
      }
    };
  }}
  on:submit|preventDefault={(e) => loginWithOauth(e.currentTarget)}
>
  <input name="token" type="hidden" />
  <button disabled={loading} class="btn variant-filled-primary">
    Authenticate with GitHub <IconBrandGithub />
  </button>
</form>

<style>
</style>
