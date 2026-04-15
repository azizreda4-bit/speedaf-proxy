export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "POST only"
      });
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const {
      url,
      method = "POST",
      payload = {},
      headers = {}
    } = body;

    if (!url) {
      return res.status(400).json({
        error: "Missing URL"
      });
    }

    // 🚀 Browser-like headers (important for Speedaf)
    const browserHeaders = {
      "Content-Type": "application/json",
      "Accept": "application/json, text/plain, */*",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36",
      "Origin": "https://mcsp.speedaf.com",
      "Referer": "https://mcsp.speedaf.com/",
      ...headers
    };

    const options = {
      method,
      headers: browserHeaders
    };

    // Only attach body for non-GET requests
    if (method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url, options);

    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    return res.status(200).send(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message || "Server error"
    });
  }
}
