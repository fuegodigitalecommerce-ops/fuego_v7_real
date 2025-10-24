import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { keyword = "navidad", country = "CO" } = req.query;

    // Validar palabra clave
    if (!keyword || keyword.trim() === "") {
      return res.status(400).json({ ok: false, error: "Falta palabra clave" });
    }

    console.log(`🔍 Buscando tendencias para: ${keyword} (${country})`);

    // ============================
    // 1️⃣ GOOGLE TRENDS (simulado)
    // ============================
    const trends = [
      { id: 1, title: `Tendencia fuerte: ${keyword}`, source: "Google Trends" },
      { id: 2, title: `Lo más buscado: ${keyword} ${country}`, source: "Google Trends" },
    ];

    // ===================================
    // 2️⃣ MERCADO LIBRE (productos reales)
    // ===================================
    const mlURL = `https://api.mercadolibre.com/sites/ML${country}/search?q=${encodeURIComponent(keyword)}`;
    const mlRes = await fetch(mlURL);
    const mlData = await mlRes.json();

    const mlResults = mlData.results
      ? mlData.results.slice(0, 4).map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          link: p.permalink,
          thumbnail: p.thumbnail,
          source: "Mercado Libre",
        }))
      : [];

    // ======================================
    // 3️⃣ GOOGLE IMAGES (Custom Search API)
    // ======================================
    const API_KEY = "TU_API_KEY_AQUI"; // ← Reemplaza aquí tu API KEY
    const CX_ID = "TU_CX_ID_AQUI"; // ← Reemplaza aquí tu CX ID

    const imageSearchURL = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}&searchType=image&num=4&key=${API_KEY}&cx=${CX_ID}`;

    const imgResponse = await fetch(imageSearchURL);
    const imgData = await imgResponse.json();

    const images = imgData.items
      ? imgData.items.map((i) => ({
          title: i.title,
          link: i.link,
          thumbnail: i.image?.thumbnailLink || "",
          source: "Google Images",
        }))
      : [];

    // ======================================
    // 4️⃣ COMBINAR RESULTADOS
    // ======================================
    const allResults = [...trends, ...mlResults, ...images];

    return res.status(200).json({
      ok: true,
      keyword,
      country,
      totalResults: allResults.length,
      results: allResults,
    });
  } catch (error) {
    console.error("🔥 Error general:", error);
    return res.status(500).json({
      ok: false,
      error: "Error interno en el servidor",
      detalle: error.message,
    });
  }
}
