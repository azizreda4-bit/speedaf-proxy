export default async function handler(req, res) {
  try {
    // Only POST allowed
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "POST only"
      });
    }

    // Vercel sometimes gives raw body → ensure safe parsing
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const { url, method = "POST", payload = {} } = body;

    if (!url) {
      return res.status(400).json({
        error: "Missing URL"
      });
    }

    // Build fetch options
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      }
    };

    // Only attach body if not GET/HEAD
    if (method !== "GET" && method !== "HEAD") {
      options.body = JSON.stringify(payload);
    }

    const response = await fetch(url, options);

    const contentType = response.headers.get("content-type");

    let data;

    // Handle JSON or text safely
    if (contentType && contentType.includes("application/json")) {
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
