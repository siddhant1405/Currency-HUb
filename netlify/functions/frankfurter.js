const FRANKFURTER_BASE_URL = "https://api.frankfurter.app";
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "GET, OPTIONS"
};

exports.handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ""
    };
  }

  const params = new URLSearchParams(event.queryStringParameters || {});
  const endpoint = (params.get("endpoint") || "currencies").replace(/^\/+/, "");
  params.delete("endpoint");

  const query = params.toString();
  const targetUrl = `${FRANKFURTER_BASE_URL}/${endpoint}${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: "application/json"
      }
    });

    const body = await response.text();

    return {
      statusCode: response.status,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": response.headers.get("content-type") || "application/json",
        "Cache-Control": "public, max-age=300"
      },
      body
    };
  } catch (error) {
    return {
      statusCode: 502,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        error: "Failed to fetch Frankfurter data",
        details: error instanceof Error ? error.message : "Unknown error"
      })
    };
  }
};
