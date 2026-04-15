export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "POST only" });
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body)
        : req.body || {};

    const { url, method = "POST", payload = {}, headers = {} } = body;

    if (!url) {
      return res.status(400).json({ error: "Missing URL" });
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        ...headers
      },
      body: (method !== "GET" && method !== "HEAD")
        ? JSON.stringify(payload)
        : undefined
    });

    const text = await response.text();

    return res.status(200).send(text);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
