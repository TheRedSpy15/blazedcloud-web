import { redirect } from "@sveltejs/kit";

export const load = async ({ request }) => {
    redirect(303, '/dashboard/files/root');
}
