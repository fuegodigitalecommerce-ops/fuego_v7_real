// /api/proxy.js
export default async function handler(req, res) {
  try {
    const url = req.query.url;
    if (!url) return res.status(400).json({ error: "URL faltante" });

    const response = await fetch(url);
    const data = await response.text();

    res.setHeader("Content-Type", "application/json");
    return res.status(200).send(data);
  } catch (err) {
    res.status(500).json({ error: "Proxy interno falló", detalle: err.message });
  }
}
