import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
    default: async ({ request, cookies }) => {
        const form = await request.formData();
        const token = form.get('token');
        if (!token || typeof token !== 'string') {
            redirect(303, '/auth');
        }
        cookies.set('pb_auth', JSON.stringify({ token: token }), { path: '/' });
        redirect(303, '/dashboard/account'); // take user to account page after login instead of files
    }
} satisfies Actions;
