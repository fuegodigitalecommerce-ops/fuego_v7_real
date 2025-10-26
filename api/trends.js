// /api/trends.js
export default async function handler(req, res) {
  const keyword = (req.query.keyword || "navidad").trim();
  const country = (req.query.country || "CO").trim();

  try {
    const apiUrl = `${req.headers.host.startsWith("localhost") ? "http" : "https"}://${req.headers.host}/api/proxy?keyword=${encodeURIComponent(
      keyword
    )}&country=${country}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    res.status(200).json({
      ok: true,
      keyword,
      country,
      source: "FUEGO_REAL_V7",
      resultsCount: data.results?.length || 0,
      results: data.results || [],
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error en /api/trends",
      detalle: error.message,
    });
  }
}
