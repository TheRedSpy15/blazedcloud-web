import { fetchFileList, getUsage } from "$lib/pocketbase/files_api.js";
import PocketBase from "pocketbase";

export const load = async ({ request, params }) => {
    const pb = new PocketBase("https://pb.blazedcloud.com");
    const cookie = request.headers.get("cookie");
    pb.authStore.loadFromCookie(cookie!);
    try {
        // get an up-to-date auth store state by veryfing and refreshing the loaded auth model (if any)
        pb.authStore.isValid && await pb.collection('users').authRefresh();
    } catch (_) {
        pb.authStore.clear();
    }

    const getCapacity = () => {
        var capacity = 5;

        if (pb.authStore.model) {
            if (pb.authStore.model.terabyte_active === true) {
                capacity = 1000;
            }
        }

        return capacity;
    }

    function getPathFromParams(): string {
        if (params.path === "root") {
            return "";
        }

        var path = decodeURIComponent(params.path);
        if (!path.endsWith("/")) path += "/";
        if (path === "/") path = "";

        return path;
    }

    return {
        userRecord: pb.authStore.model,
        fileList: fetchFileList(pb.authStore.token, pb.authStore.model?.id, getPathFromParams()),
        cookie: request.headers.get("cookie"),
        usage: getUsage(pb.authStore.model?.id, pb.authStore.token),
        capacity: getCapacity(),
        path: getPathFromParams()
    }
}