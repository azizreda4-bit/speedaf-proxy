export default async function handler(req, res) {
  try {
    // Allow only POST (important for Apps Script)
    if (req.method !== "POST") {
      return res.status(405).json({
        error: "Only POST requests are allowed"
      });
    }

    const body = req.body || {};

    const url = body.url;
    const method = body.method || "POST";
    const payload = body.payload || {};

    // Validate URL
    if (!url) {
      return res.status(400).json({
        error: "Missing 'url' in request body"
      });
    }

    // Forward request
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: method === "GET" ? undefined : JSON.stringify(payload)
    });

    const contentType = response.headers.get("content-type");

    let data;

    // Handle JSON or text safely
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
      return res.status(200).json(data);
    } else {
      data = await response.text();
      return res.status(200).send(data);
    }

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
