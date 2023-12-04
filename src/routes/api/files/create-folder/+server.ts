// refer to: https://stackoverflow.com/a/70476346
export async function PUT({ request, fetch }) {
    const { type, uploadUrl, bytes, length } = await request.json();

    const headers = new Headers();
    headers.append("Content-Type", type);
    headers.append("Content-Length", length.toString());

    const reponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: headers,
        body: bytes,
        redirect: 'follow',
    })
    return new Response(null, { status: reponse.status });
}