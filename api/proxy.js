export default async function handler(req, res) {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "Falta la URL" });

    const response = await fetch(url);
    const data = await response.text();

    res.status(200).send(data);
  } catch (error) {
    res.status(500).json({ error: "Error en el proxy", detalle: error.message });
  }
}
