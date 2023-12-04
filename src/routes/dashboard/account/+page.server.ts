import PocketBase from "pocketbase";

export const load = async ({ request }) => {
    const pb = new PocketBase("https://pb.blazedcloud.com");
    const cookie = request.headers.get("cookie");
    pb.authStore.loadFromCookie(cookie!);
    try {
        // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
        pb.authStore.isValid && await pb.collection('users').authRefresh();
    } catch (_) {
        pb.authStore.clear();
    }

    return {
        userRecord: pb.authStore.model,
    }
}