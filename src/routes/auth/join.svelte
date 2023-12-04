<script lang="ts">
  import { enhance } from "$app/forms";
  import { getToastStore, type ToastSettings } from "@skeletonlabs/skeleton";
  import PocketBase from "pocketbase";

  const toastStore = getToastStore();

  const pb = new PocketBase("https://pb.blazedcloud.com");

  async function join(form: HTMLFormElement) {
    try {
      await pb.collection("users").create({
        email: form.email.value,
        emailVisibility: true,
        password: form.password.value,
        passwordConfirm: form.passwordConfirm.value,
      });
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
        message: "Regristration failed.",
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
  on:submit|preventDefault={(e) => join(e.currentTarget)}
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
  <input
    type="password"
    id="passwordConfirm"
    class="input input-primary input-bordered"
    placeholder="Confirm Password"
  />
  <button disabled={loading} class="btn variant-filled-primary">Join</button>
</form>

<style>
</style>
