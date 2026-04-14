import fetch from "node-fetch";

export default async function handler(req, res) {
  try {

    const body = req.body || {};

    const url = body.url;
    const method = body.method || "POST";
    const payload = body.payload || {};

    if (!url) {
      return res.status(400).json({
        error: "Missing 'url' in request body"
      });
    }

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.text();

    res.status(200).send(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
