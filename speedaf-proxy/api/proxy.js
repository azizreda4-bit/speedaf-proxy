import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { url, method = "POST", payload } = req.body;

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      },
      body: JSON.stringify(payload || {})
    });

    const data = await response.text();

    res.status(200).send(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}