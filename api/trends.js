import fetch from "node-fetch";

export default async function handler(req, res) {
  const keyword = req.query.keyword || "navidad";
  const country = req.query.country || "CO";

  try {
    const results = [
      { id: 1, title: "Decoración navideña artesanal", source: "FUEGO_AI" },
      { id: 2, title: "Luces LED y adornos festivos", source: "FUEGO_AI" },
      { id: 3, title: "Regalos personalizados en tendencia", source: "FUEGO_AI" },
      { id: 4, title: "Accesorios ecológicos para el hogar", source: "FUEGO_AI" }
    ];

    return res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results
    });
  } catch (error) {
    console.error("Error en trends.js:", error);
    return res.status(500).json({
      ok: false,
      error: "Error interno en el servidor",
      detalle: error.message
    });
  }
}
