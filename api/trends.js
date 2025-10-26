// /api/trends.js
export default async function handler(req, res) {
  const { keyword = "tendencias", country = "CO" } = req.query;

  const apiKey = process.env.GOOGLE_API_KEY;
  const cx = process.env.GOOGLE_CX;

  try {
    // Llamada a la API de Google Custom Search
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(keyword)}&num=10`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items) {
      return res.status(200).json({
        ok: false,
        error: "Sin resultados o error en Google API",
        detalle: data.error || "Verifica tu API Key y CX"
      });
    }

    const results = data.items.map((item, i) => ({
      id: i + 1,
      title: item.title,
      link: item.link,
      snippet: item.snippet,
      source: "Google Search"
    }));

    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error al obtener datos de Google",
      detalle: error.message
    });
  }
}
