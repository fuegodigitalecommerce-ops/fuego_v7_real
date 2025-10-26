// api/trends.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { keyword = "navidad", country = "CO" } = req.query;

    // API de Google Custom Search
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CX = process.env.GOOGLE_CX;

    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}+productos&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}`;

    const googleRes = await fetch(searchUrl);
    const googleData = await googleRes.json();

    if (!googleData.items) {
      return res.status(200).json({
        ok: false,
        error: "No se encontraron resultados en Google.",
      });
    }

    // Armar respuesta
    const results = googleData.items.slice(0, 10).map((item, index) => ({
      id: index + 1,
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
  } catch (error) {
    return res.status(500).json({
      ok: false,
      error: "Error en el servidor",
      detalle: error.message,
    });
  }
}
