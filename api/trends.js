export default async function handler(req, res) {
  try {
    const { keyword = "navidad", country = "CO" } = req.query;

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

    // Si no hay claves, detener
    if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
      return res.status(500).json({
        ok: false,
        error: "Faltan claves de API",
        detalle: "Configura GOOGLE_API_KEY y GOOGLE_CSE_ID en las variables de entorno",
      });
    }

    // --- 1️⃣ Buscar imágenes y productos en Google Custom Search
    const searchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword + " site:mercadolibre.com " + country
    )}&cx=${GOOGLE_CSE_ID}&key=${GOOGLE_API_KEY}&num=10&searchType=image`;

    const resp = await fetch(searchUrl);
    const googleData = await resp.json();

    if (!googleData.items) {
      return res.status(200).json({
        ok: true,
        keyword,
        country,
        results: [],
        detalle: "Sin resultados desde Google",
      });
    }

    // --- 2️⃣ Estructurar resultados
    const results = googleData.items.map((item, index) => ({
      id: index + 1,
      title: item.title || "Producto en tendencia",
      link: item.image?.contextLink || item.link,
      image: item.link || item.image?.thumbnailLink,
      source: item.displayLink || "Google Shopping",
    }));

    // --- 3️⃣ Enviar respuesta final
    return res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results,
    });
  } catch (error) {
    console.error("Error en trends.js:", error);
    return res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      detalle: error.message,
    });
  }
}
