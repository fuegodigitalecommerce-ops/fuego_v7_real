// api/trends.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const { keyword = "navidad", country = "CO" } = req.query;

    // Simulación inicial — más adelante se reemplaza con Google Trends real
    const trends = [
      { id: 1, title: "Decoración navideña artesanal", source: "FUEGO_AI" },
      { id: 2, title: "Luces LED y adornos festivos", source: "FUEGO_AI" },
      { id: 3, title: "Regalos personalizados en tendencia", source: "FUEGO_AI" },
      { id: 4, title: "Accesorios ecológicos para el hogar", source: "FUEGO_AI" }
    ];

    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: trends.length,
      results: trends
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error interno del servidor",
      detalle: error.message
    });
  }
}
