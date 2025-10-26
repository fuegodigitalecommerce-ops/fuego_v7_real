// api/trends.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { keyword = "navidad", country = "CO" } = req.query;

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CX = process.env.GOOGLE_CX;

    if (!GOOGLE_API_KEY || !GOOGLE_CX) {
      return res.status(500).json({
        ok: false,
        error: "Faltan claves de Google",
      });
    }

    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}+productos&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}`;

    const response = await fetch(searchUrl);
    const data = await response.json();

    if (!data.items) {
      return res.status(200).json({
        ok: false,
        error: "Sin resultados en Google",
      });
    }

    const results = data.items.slice(0, 10).map((item, i) => ({
      id: i + 1,
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: "Google",
    }));

    return res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results,
    });
  } catch (err) {
    return res.status(500).json({
      ok: false,
      error: "Error en servidor",
      detalle: err.message,
    });
  }
}
