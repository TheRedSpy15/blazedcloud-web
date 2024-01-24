import {sequence} from '@sveltejs/kit/hooks';
import * as Sentry from '@sentry/sveltekit';
import { building } from '$app/environment';
import { redirect, type Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

Sentry.init({
    dsn: "https://ce673dccb69c3ddb19dba10e1f511232@o4504715701518336.ingest.sentry.io/4506624535494656",
    tracesSampleRate: 1
})

export const handle: Handle = sequence(Sentry.sentryHandle(), async ({ event, resolve }) => {
    if (event.url.pathname.startsWith('/api/')) {
        return await resolve(event);
    }

    event.locals.id = '';
    event.locals.email = '';
    event.locals.pb = new PocketBase('https://pb.blazedcloud.com');

    const isAuth: boolean = event.url.pathname === '/auth';
    if (isAuth || building) {
        event.cookies.set('pb_auth', '', { path: '/' });
        return await resolve(event);
    }

    const pb_auth = event.request.headers.get('cookie') ?? '';
    event.locals.pb.authStore.loadFromCookie(pb_auth);

    if (!event.locals.pb.authStore.isValid) {
        if (event.url.pathname === '/auth/forgot') {
            return await resolve(event);
        } else if (event.url.pathname === '/auth/subscribe') {
            return await resolve(event);
        }
        console.log('Session expired');
        redirect(303, '/auth');
    }
    try {
        const auth = await event.locals.pb
            .collection('users')
            .authRefresh<{ id: string; email: string }>();
        event.locals.id = auth.record.id;
        event.locals.email = auth.record.email;
    } catch (_) {
        redirect(303, '/auth');
    }

    if (!event.locals.id) {
        redirect(303, '/auth');
    }

    const response = await resolve(event);
    const cookie = event.locals.pb.authStore.exportToCookie({ sameSite: 'lax' });
    response.headers.append('set-cookie', cookie);
    return response;
});
export const handleError = Sentry.handleErrorWithSentry();