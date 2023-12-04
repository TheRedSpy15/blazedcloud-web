<script lang="ts">
  import { enhance } from "$app/forms";
  import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
  import PocketBase from "pocketbase";

  const toastStore = getToastStore();

  const pb = new PocketBase("https://pb.blazedcloud.com");

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

  let loading: boolean = false;
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

<style>
</style>
