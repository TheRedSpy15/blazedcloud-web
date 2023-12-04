<script lang="ts">
  import { Avatar } from "@skeletonlabs/skeleton";
  import { IconReportMoney } from "@tabler/icons-svelte";

  export let data;
  $: ({ userRecord } = data);
</script>

<div class="flex flex-col content-between space-y-6">
  <Avatar
    src="https://api.dicebear.com/7.x/open-peeps/svg?seed={Date.now()}"
    alt="avatar"
    width="w-32"
    rounded="rounded-full"
    class="mx-auto"
  />
  <h1 class="h1">Account Management</h1>
  <aside class="alert variant-filled-surface">
    <!-- Icon -->
    <div><IconReportMoney /></div>
    <!-- Message -->
    <div class="alert-message">
      <h3 class="h3">Billing Notice</h3>
      <p class="max-w-s">
        Please note that your subscription must be managed through the app store
        that you purchased it from. If you are unable to manage your
        subscription, please contact us at <a
          href="mailto:billing@blazedcloud.com">billing@blazedcloud.com</a
        >
      </p>
    </div>
  </aside>
  <p>Email: {userRecord?.email}</p>

  <h2 class="h2">Don't have the app?</h2>

  <p>
    <a
      class="max-w-s"
      href="https://play.google.com/store/apps/details?id=com.chancesoftwarellc.blazedcloud"
      ><enhanced:img
        src="$lib/assets/qrcode.webp"
        alt="QR code to download app for android"
        class="w-48"
      /></a
    >Scan or click QR to download for Android
  </p>
</div>

<style>
</style>
