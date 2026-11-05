import type { NextRequest } from "next/server";
import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
    if (request.nextUrl.pathname.endsWith("/token")) {
        return Response.json(
            { error: "API tokens are only available to server-side routes." },
            { status: 404 },
        );
    }

    return handlers.GET(request);
}

export const POST = handlers.POST;
