import PocketBase, { type AuthModel } from "pocketbase";

export function getPBAuthFromCookie(cookie: string): AuthModel {
    const pb = new PocketBase("https://pb.blazedcloud.com");
    pb.authStore.loadFromCookie(cookie!);
    return pb.authStore.model;
}