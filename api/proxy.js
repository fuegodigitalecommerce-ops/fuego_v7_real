// /api/proxy.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  const keyword = (req.query.keyword || "navidad").trim();
  const country = (req.query.country || "CO").trim();

  try {
    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

    if (!GOOGLE_API_KEY || !SEARCH_ENGINE_ID) {
      return res.status(500).json({
        ok: false,
        error: "Faltan claves de Google",
        detalle: "Define GOOGLE_API_KEY y SEARCH_ENGINE_ID en Vercel"
      });
    }

    // 🔹 1. Google Custom Search (para tendencias e imágenes)
    const googleSearchUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}&cx=${SEARCH_ENGINE_ID}&key=${GOOGLE_API_KEY}&num=10&searchType=image`;

    const googleRes = await fetch(googleSearchUrl);
    const googleData = await googleRes.json();

    const googleResults =
      googleData.items?.map((item, i) => ({
        id: `G-${i + 1}`,
        title: item.title,
        image: item.link,
        context: item.image?.contextLink || item.link,
        source: "Google Images"
      })) || [];

    // 🔹 2. Mercado Libre API (productos en tendencia)
    const mercadoLibreUrl = `https://api.mercadolibre.com/sites/ML${country}/search?q=${encodeURIComponent(
      keyword
    )}`;
    const mlRes = await fetch(mercadoLibreUrl);
    const mlData = await mlRes.json();

    const mlResults =
      mlData.results?.slice(0, 10).map((item, i) => ({
        id: `ML-${i + 1}`,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
        link: item.permalink,
        source: "Mercado Libre"
      })) || [];

    // 🔹 3. Unir todo
    const combinedResults = [...mlResults, ...googleResults];

    if (combinedResults.length === 0) {
      return res.status(200).json({
        ok: false,
        error: "No se encontraron resultados",
        detalle: "Google y Mercado Libre devolvieron vacío"
      });
    }

    // ✅ Respuesta final combinada
    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: combinedResults.length,
      results: combinedResults
    });
  } catch (error) {
    console.error("Error en /api/proxy:", error);
    res.status(500).json({
      ok: false,
      error: "Error en el proxy combinado",
      detalle: error.message
    });
  }
}
