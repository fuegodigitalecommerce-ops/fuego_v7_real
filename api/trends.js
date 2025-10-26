// /api/trends.js
export default async function handler(req, res) {
  const { keyword = "navidad", country = "CO" } = req.query;

  try {
    // Buscar productos en Google (Custom Search API)
    const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&key=${process.env.GOOGLE_API_KEY}&searchType=image`;

    const googleRes = await fetch(googleUrl);
    const googleData = await googleRes.json();

    const googleResults = (googleData.items || []).slice(0, 10).map((item) => ({
      title: item.title,
      link: item.image?.contextLink || item.link,
      image: item.link,
      source: "Google",
    }));

    // Buscar productos en Mercado Libre
    const mlUrl = `https://api.mercadolibre.com/sites/ML${country}/search?q=${encodeURIComponent(
      keyword
    )}`;
    const mlRes = await fetch(mlUrl);
    const mlData = await mlRes.json();

    const mlResults = (mlData.results || []).slice(0, 10).map((item) => ({
      title: item.title,
      link: item.permalink,
      image: item.thumbnail,
      source: "Mercado Libre",
      price: item.price,
      seller: item.seller?.nickname || "Desconocido",
    }));

    const results = [...googleResults, ...mlResults];

    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: "Error al obtener datos reales",
      detalle: err.message,
    });
  }
}
