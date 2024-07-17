<script lang="ts">
  import PocketBase from "pocketbase";

  export let data;
  $: ({ userRecord, token } = data);

  $: isUsingMobileStore =
    userRecord?.active_tier.length > 0 && !userRecord?.stripe_active;

  function checkout() {
    var headers = new Headers();
    headers.append("Authorization", "Bearer " + token);
    headers.append("User-Agent", "blazed-portal");

    var formData = new FormData();
    formData.append("priceId", "price_1PT9opEnqBPpR1rOXXMAc5pY");

    fetch("https://pb.blazedcloud.com/stripe/checkout/" + userRecord?.id, {
      method: "POST",
      headers: headers,
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        window.location.href = data.url;
      });
  }

  let deleteButtonText = "Delete Account";
  let deleteConfirmationStep = 0;

  async function deleteAccount() {
    try {
      const pb = new PocketBase("https://pb.blazedcloud.com");
      await pb.collection("users").delete(userRecord?.id);
      window.location.href = "/auth";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again later.");
    }
  }

  function handleDeleteClick() {
    if (deleteConfirmationStep === 0) {
      deleteButtonText = "Confirm?";
      deleteConfirmationStep = 1;
    } else {
      deleteAccount();
    }
  }
</script>

<div class="flex flex-col content-between space-y-6">
  <aside class="alert variant-filled-surface">
    <div class="alert-message flex flex-col content-between space-y-6">
      <h3 class="h3">Subscription</h3>
      {#if !isUsingMobileStore}
        {#if userRecord?.active_tier.length > 0}
          You have an active subscription through Stripe. You can manage your
          subscription there.
          <button
            class="btn btn-primary bg-primary-700"
            on:click={() =>
              (window.location.href =
                "https://billing.stripe.com/p/login/fZeaI4a7Teoycuc5kk")}
          >
            <a href="https://billing.stripe.com/p/login/fZeaI4a7Teoycuc5kk"
              >Manage On Stripe</a
            >
          </button>
        {:else if userRecord}
          You don't have an active subscription currently. You can subscribe
          using your preferred app store, or using Stripe.
          <button
            class="btn btn-primary bg-primary-700"
            on:click={() => checkout()}
          >
            Subscribe with Stripe
          </button>
        {/if}
      {:else}
        You have an active subscription using either the Apple App Store or
        Google Play Store. You can manage your subscription there.
      {/if}
    </div>
  </aside>

  <aside class="alert variant-filled-surface w-full">
    <div class="alert-message flex flex-col w-full content-between space-y-6">
      <h3 class="h3">Delete Account</h3>
      {#if !isUsingMobileStore}
        {#if userRecord?.active_tier.length > 0}
          You have an active subscription through Stripe. You can manage your
          subscription there.
          <button
            class="btn btn-primary bg-primary-700"
            on:click={() =>
              (window.location.href =
                "https://billing.stripe.com/p/login/fZeaI4a7Teoycuc5kk")}
          >
            <a href="https://billing.stripe.com/p/login/fZeaI4a7Teoycuc5kk"
              >Manage On Stripe</a
            >
          </button>
        {:else if userRecord}
          Deletes your account and all of your data. This action cannot be
          <button
            class="btn btn-primary bg-red-900 w-full"
            on:click={() => handleDeleteClick()}
          >
            {deleteButtonText}
          </button>
        {/if}
      {:else}
        You have an active subscription using either the Apple App Store or
        Google Play Store. You can manage your subscription there.
      {/if}
    </div>
  </aside>
</div>

<style>
</style>
