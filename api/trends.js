export default async function handler(req, res) {
  const { keyword = "", country = "CO" } = req.query;

  // Validación rápida
  if (!keyword) {
    return res.status(400).json({ ok: false, error: "Falta el parámetro keyword" });
  }

  try {
    // --- 1️⃣ Google Custom Search ---
    const googleKey = process.env.GOOGLE_API_KEY;
    const googleCx = process.env.GOOGLE_CX_ID;

    const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword + " " + country
    )}&key=${googleKey}&cx=${googleCx}&num=5`;

    const googleRes = await fetch(googleUrl);
    const googleData = await googleRes.json();

    // --- 2️⃣ Mercado Libre (API oficial) ---
    const meliUrl = `${process.env.MELI_API_URL}/sites/ML${country}/search?q=${encodeURIComponent(
      keyword
    )}`;
    const meliRes = await fetch(meliUrl);
    const meliData = await meliRes.json();

    // --- 3️⃣ Mezclamos resultados ---
    const googleResults =
      googleData.items?.map((item) => ({
        title: item.title,
        link: item.link,
        image: item.pagemap?.cse_image?.[0]?.src || "",
        source: "Google",
      })) || [];

    const meliResults =
      meliData.results?.slice(0, 5).map((item) => ({
        title: item.title,
        link: item.permalink,
        image: item.thumbnail,
        source: "MercadoLibre",
      })) || [];

    const results = [...googleResults, ...meliResults];

    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results,
    });
  } catch (error) {
    console.error("🔥 Error interno en /api/trends:", error);
    res.status(500).json({ ok: false, error: "Error interno del servidor" });
  }
}
