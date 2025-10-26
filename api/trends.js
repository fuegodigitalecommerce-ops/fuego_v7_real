import fetch from "node-fetch";

export default async function handler(req, res) {
  const { keyword = "navidad", country = "CO" } = req.query;

  try {
    // --- 🔥 1. Google Custom Search (Imágenes)
    const googleKey = process.env.GOOGLE_API_KEY;
    const googleCx = process.env.GOOGLE_CX_ID;

    const googleURL = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}+${country}&cx=${googleCx}&key=${googleKey}&searchType=image&num=5`;

    const googleRes = await fetch(googleURL);
    const googleData = await googleRes.json();

    // --- 🛍️ 2. Mercado Libre (Productos)
    const mlURL = `https://api.mercadolibre.com/sites/ML${country}/search?q=${encodeURIComponent(
      keyword
    )}`;
    const mlRes = await fetch(mlURL);
    const mlData = await mlRes.json();

    const googleResults = (googleData.items || []).map((img, i) => ({
      id: i + 1,
      title: img.title,
      image: img.link,
      link: img.image?.contextLink || img.link,
      source: "Google Images",
    }));

    const mlResults = (mlData.results || []).slice(0, 10).map((p) => ({
      id: p.id,
      title: p.title,
      image: p.thumbnail,
      link: p.permalink,
      price: p.price,
      source: "Mercado Libre",
    }));

    const allResults = [...mlResults, ...googleResults];

    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: allResults.length,
      results: allResults,
    });
  } catch (err) {
    res.status(500).json({
      ok: false,
      error: "Error al obtener datos",
      detalle: err.message,
    });
  }
}
