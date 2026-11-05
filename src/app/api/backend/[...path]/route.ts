import { auth } from "@/lib/auth";

const API_BASE_URL =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "http://localhost:8000";

function isAllowedRoute(method: string, path: string[]) {
    if (path.length === 2 && path[0] === "my-studios" && method === "GET") {
        return true;
    }
    if (path.length === 1 && path[0] === "host-bookings" && method === "GET") {
        return true;
    }
    if (path.length === 2 && path[0] === "my-bookings") {
        return method === "GET" || method === "DELETE";
    }
    if (path.length === 2 && path[0] === "wishlist" && method === "GET") {
        return true;
    }
    if (path.length === 1 && path[0] === "wishlist" && method === "POST") {
        return true;
    }
    if (path.length === 1 && path[0] === "add-studio" && method === "POST") {
        return true;
    }
    if (path.length === 1 && path[0] === "booking" && method === "POST") {
        return true;
    }
    if (path.length === 2 && path[0] === "studio") {
        return method === "PATCH" || method === "DELETE";
    }
    return (
        path.length === 3 &&
        path[0] === "booking" &&
        ["cancel", "host-decision"].includes(path[2]) &&
        method === "PATCH"
    );
}

async function proxyRequest(
    request: Request,
    context: { params: Promise<{ path: string[] }> },
) {
    const { path } = await context.params;
    const method = request.method.toUpperCase();
    if (!isAllowedRoute(method, path)) {
        return Response.json(
            { error: "API route not found." },
            { status: 404 },
        );
    }

    if (method !== "GET") {
        const origin = request.headers.get("origin");
        if (!origin) {
            return Response.json(
                { error: "Request origin is required." },
                { status: 403 },
            );
        }
        try {
            if (new URL(origin).origin !== new URL(request.url).origin) {
                return Response.json(
                    { error: "Invalid request origin." },
                    { status: 403 },
                );
            }
        } catch {
            return Response.json(
                { error: "Invalid request origin." },
                { status: 403 },
            );
        }
    }

    const session = await auth.api.getSession({ headers: request.headers });
    if (!session) {
        return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { token } = await auth.api.getToken({ headers: request.headers });
    if (!token) {
        return Response.json(
            { error: "Unable to authorize API request." },
            { status: 401 },
        );
    }

    const target = new URL(
        `${path.map((segment) => encodeURIComponent(segment)).join("/")}${new URL(request.url).search}`,
        `${API_BASE_URL.replace(/\/+$/, "")}/`,
    );
    const headers = new Headers({
        Authorization: `Bearer ${token}`,
        Accept: request.headers.get("accept") ?? "application/json",
    });
    const contentType = request.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);

    const response = await fetch(target, {
        method,
        headers,
        body: method === "GET" ? undefined : await request.arrayBuffer(),
        cache: "no-store",
    });
    const responseHeaders = new Headers();
    const responseType = response.headers.get("content-type");
    if (responseType) responseHeaders.set("Content-Type", responseType);
    responseHeaders.set("Cache-Control", "no-store");

    return new Response(response.body, {
        status: response.status,
        headers: responseHeaders,
    });
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
