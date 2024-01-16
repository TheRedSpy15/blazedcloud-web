import { redirect } from "@sveltejs/kit";
import PocketBase from "pocketbase";
import type { Actions } from './$types';

export const actions = {
    default: async ({ request }) => {
        const form = await request.formData();

        const pb = new PocketBase("https://pb.blazedcloud.com");
        const email = form.get('email');
        if (email || typeof email === 'string') {
            await pb.collection("users").requestPasswordReset(email.toString());
        }
        redirect(303, '/auth');
    }
} satisfies Actions;
