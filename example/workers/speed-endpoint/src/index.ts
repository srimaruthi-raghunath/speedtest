export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/__ping") {
      return new Response("pong", {
        headers: {
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
          "Content-Type": "application/octet-stream",
          "Cache-Control": "no-store",
        },
      });
    }


    if (url.pathname === "/__up") {
      await request.arrayBuffer();

      return new Response("OK", {
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }


    return new Response("Speed endpoint worker");
  },
};