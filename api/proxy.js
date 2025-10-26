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
        detalle: "Agrega GOOGLE_API_KEY y SEARCH_ENGINE_ID en las variables de entorno de Vercel"
      });
    }

    // 🔹 Google Custom Search (para imágenes y temas relacionados)
    const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}&cx=${SEARCH_ENGINE_ID}&key=${GOOGLE_API_KEY}&num=10&searchType=image`;

    const googleRes = await fetch(googleUrl);
    const googleData = await googleRes.json();

    const googleResults =
      googleData.items?.map((item, i) => ({
        id: `G-${i + 1}`,
        title: item.title,
        image: item.link,
        context: item.image?.contextLink || item.link,
        source: "Google Images",
      })) || [];

    // 🔹 Mercado Libre API (productos en tendencia)
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
        source: "Mercado Libre",
      })) || [];

    // 🔹 Combinar todo
    const combinedResults = [...mlResults, ...googleResults];

    if (combinedResults.length === 0) {
      return res.status(200).json({
        ok: false,
        error: "No se encontraron resultados",
        detalle: "Google y Mercado Libre devolvieron vacío"
      });
    }

    // ✅ Respuesta final
    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: combinedResults.length,
      results: combinedResults,
    });
  } catch (error) {
    console.error("Error en /api/proxy:", error);
    res.status(500).json({
      ok: false,
      error: "Error interno en el proxy",
      detalle: error.message,
    });
  }
}
