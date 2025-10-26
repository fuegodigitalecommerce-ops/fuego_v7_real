import fetch from "node-fetch";

export default async function handler(req, res) {
  const { keyword = "", country = "CO" } = req.query;

  if (!keyword) {
    return res.status(400).json({ ok: false, error: "Falta palabra clave" });
  }

  try {
    const results = [];

    // === GOOGLE CUSTOM SEARCH ===
    const googleKey = process.env.GOOGLE_API_KEY;
    const googleCx = process.env.GOOGLE_CX;

    const googleUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}+${country}&cx=${googleCx}&key=${googleKey}&searchType=image&num=10`;

    const googleRes = await fetch(googleUrl);
    const googleData = await googleRes.json();

    if (googleData.items) {
      googleData.items.forEach((item, idx) => {
        results.push({
          id: `G${idx + 1}`,
          title: item.title,
          link: item.link,
          image: item.image?.thumbnailLink || item.link,
          source: "Google Images",
        });
      });
    }

    // === MERCADO LIBRE ===
    const meliUrl = `${process.env.MELI_API_URL}/${country}/search?q=${encodeURIComponent(
      keyword
    )}`;
    const meliRes = await fetch(meliUrl);
    const meliData = await meliRes.json();

    if (meliData.results) {
      meliData.results.slice(0, 10).forEach((p, idx) => {
        results.push({
          id: `M${idx + 1}`,
          title: p.title,
          price: p.price,
          link: p.permalink,
          image: p.thumbnail,
          source: "Mercado Libre",
          seller: p.seller?.nickname || "Proveedor no identificado",
        });
      });
    }

    if (results.length === 0) {
      return res.json({
        ok: true,
        keyword,
        country,
        resultsCount: 0,
        results: [],
        message: "Sin resultados reales",
      });
    }

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
      error: err.message,
      detalle: "Error en la conexión con APIs externas",
    });
  }
}
