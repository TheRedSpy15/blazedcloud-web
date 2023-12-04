import { redirect } from "@sveltejs/kit";

export const load = async ({ request }) => {
    throw redirect(303, '/dashboard/files/root');
}
