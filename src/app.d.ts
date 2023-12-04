// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import PocketBase from 'pocketbase';
declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            pb: PocketBase;
            id: string;
            email: string;
        }
        // interface PageData {}
        // interface Platform {}
    }
}

export { };
