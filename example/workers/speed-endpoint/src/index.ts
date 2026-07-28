const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
  "Cache-Control": "no-store",
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    if (url.pathname === "/__ping") {
      return new Response("pong", {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain",
        },
      });
    }

    if (url.pathname === "/__ip") {
      return new Response(
        JSON.stringify({
          ip: request.headers.get("CF-Connecting-IP"),
        }),
        {
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (url.pathname === "/__down") {
      const bytes =
        Number(url.searchParams.get("bytes")) || 1000000;

      const data = new Uint8Array(bytes);

      crypto.getRandomValues(
        data.subarray(0, Math.min(bytes, 65536))
      );

      return new Response(data, {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/octet-stream",
        },
      });
    }

    if (url.pathname === "/__up") {
      await request.arrayBuffer();

      return new Response("OK", {
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain",
        },
      });
    }

    return new Response("Speed endpoint worker", {
      headers: corsHeaders,
    });
  },
};
