<script lang="ts">
  import { enhance } from "$app/forms";
</script>

<div class="container h-full mx-auto flex justify-center items-center">
  <div class="space-y-10 text-center flex flex-col items-center">
    <h2 class="h2">Reset Password</h2>
    <p class="text-lg">
      Enter your email address and we'll send you a link to reset your password.
    </p>
    <form method="post" class="space-y-4" use:enhance>
      <input name="token" type="hidden" />
      <input
        type="email"
        id="email"
        class="input input-primary input-bordered"
        placeholder="Email"
      />
      <button class="btn variant-filled-primary">Reset Password</button>
    </form>
  </div>
</div>

<style>
</style>
