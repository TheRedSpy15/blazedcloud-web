import { fetchFileList, getUsage } from "$lib/pocketbase/files_api.js";

export const load = async ({ params, locals }) => {
    const getCapacity = () => {
        var capacity = 5;

        if (locals.pb.authStore.model) {
            capacity = locals.pb.authStore.model.capacity_gigs;
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
        fileList: await fetchFileList(locals.pb.authStore.token, locals.pb.authStore.model?.id, getPathFromParams()),
        usage: await getUsage(locals.pb.authStore.model?.id, locals.pb.authStore.token),
        capacity: getCapacity(),
        path: getPathFromParams(),
        token: locals.pb.authStore.token,
        uid: locals.pb.authStore.model?.id,
    }
}