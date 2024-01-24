import { sentrySvelteKit } from "@sentry/sveltekit";
import { enhancedImages } from '@sveltejs/enhanced-img';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { purgeCss } from 'vite-plugin-tailwind-purgecss';

export default defineConfig({
    plugins: [sentrySvelteKit({
        sourceMapsUploadOptions: {
            org: "chance-software-llc",
            project: "blazed-cloud-web"
        }
    }), sveltekit(), purgeCss(), enhancedImages()]
});