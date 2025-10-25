// /api/trends.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const keyword = String(req.query.keyword || "navidad").trim();
    const country = String(req.query.country || "LATAM").trim();

    // --- 1️⃣ Google Trends API pública (proxy interno)
    const googleTrendsURL = `https://trends.google.com/trends/api/widgetdata/relatedsearches?hl=es-419&tz=-300&geo=${country}&req={"restriction":{"type":"COUNTRY","geo":{"country":"${country}"}},"keywordType":"QUERY","keyword":"${keyword}","time":"today 12-m"}&token=APP6_UEAAAAAZfCzq8z1gI3D2skBkYYKXy8wTGae2hvU`;

    const trendsResponse = await fetch(googleTrendsURL, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; FUEGO/1.0)" }
    });
    let raw = await trendsResponse.text();
    raw = raw.replace(/^[^\{]+/, "").trim();
    let json = {};

    try {
      json = JSON.parse(raw);
    } catch {
      json = null;
    }

    let trends = [];
    if (json?.default?.rankedList?.length) {
      const items = json.default.rankedList[0].rankedKeyword || [];
      trends = items.slice(0, 10).map((t, i) => ({
        id: i + 1,
        title: t.query,
        source: "Google Trends"
      }));
    }

    // --- 2️⃣ Productos de Mercado Libre
    const mercadoLibreURL = `https://api.mercadolibre.com/sites/ML${country}/search?q=${encodeURIComponent(
      keyword
    )}&limit=10`;
    let productos = [];
    try {
      const ml = await fetch(mercadoLibreURL);
      const data = await ml.json();
      if (data.results) {
        productos = data.results.slice(0, 10).map((p, i) => ({
          id: trends.length + i + 1,
          title: p.title,
          source: "MercadoLibre"
        }));
      }
    } catch (err) {
      console.warn("MercadoLibre bloqueado:", err.message);
    }

    // --- 3️⃣ Resultado combinado
    const results = [...trends, ...productos];
    return res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results
    });
  } catch (err) {
    console.error("🔥 Error general:", err);
    return res.status(500).json({
      ok: false,
      error: "Error al obtener datos",
      detalle: err.message
    });
  }
}
