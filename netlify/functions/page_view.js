const { getStore } = require("@netlify/blobs");

exports.handler = async (event) => {
  try {
    const page = event.queryStringParameters?.page;
    if (!page) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing ?page=" }),
      };
    }

    // Store persistente (mismo en todos los deploys)
    const store = getStore("page-views");

    // Key segura (evita caracteres raros)
    const key = `views:${page}`;

    const currentRaw = await store.get(key);
    const current = Number(currentRaw || 0);
    const next = current + 1;

    await store.set(key, String(next));

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
      body: JSON.stringify({
        data: {
          page_url: page,
          view_count: next,
          last_modified: new Date().toISOString(),
        },
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: String(err) }),
    };
  }
};
