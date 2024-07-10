<script lang="ts">
  import { browser } from "$app/environment";
  import { onDestroy, onMount } from "svelte";

  let editorInstance: any;

  onMount(async () => {
    if (browser) {
      const EditorJS = (await import("@editorjs/editorjs")).default;
      const Header = (await import("@editorjs/header")).default;

      editorInstance = new EditorJS({
        holder: "editorjs",
        tools: {
          header: Header,
        },
        data: {
          blocks: [
            {
              type: "header",
              data: {
                text: "Welcome to Blazed Cloud Editor",
                level: 2,
              },
            },
            {
              type: "paragraph",
              data: {
                text: "Start editing your document here...",
              },
            },
          ],
        },
      });
    }
  });

  onDestroy(() => {
    if (browser && editorInstance) {
      editorInstance.destroy();
    }
  });

  async function saveContent() {
    if (browser && editorInstance) {
      const savedData = await editorInstance.save();
      console.log("savedData", savedData);
      // Here you would typically send this data to your backend
      // For example: await fetch('/api/save-document', { method: 'POST', body: JSON.stringify(savedData) });
    }
  }
</script>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Blazed Cloud Editor</h1>

  <div class="mb-4">
    <button class="btn btn-sm variant-filled-primary" on:click={saveContent}
      >Save Content</button
    >
  </div>

  <div
    id="editorjs"
    class="border p-4 rounded-lg bg-surface-100-800-token"
  ></div>
</div>

<style>
  :global(.codex-editor__redactor) {
    padding-bottom: 100px !important;
  }

  :global(.ce-block__content),
  :global(.ce-toolbar__content) {
    max-width: calc(100% - 80px) !important;
  }

  :global(.codex-editor) {
    color: var(--color-text-base);
  }
</style>
