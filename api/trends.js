import fetch from "node-fetch";

export default async function handler(req, res) {
  const { keyword = "moda", country = "CO" } = req.query;

  try {
    // 1️⃣ Google Trends (datos de interés)
    const trendsUrl = `https://trends.google.com/trends/api/widgetdata/relatedsearches?hl=es-419&tz=-300&geo=${country}&req={"restriction":{"type":"COUNTRY","geo":{"country":"${country}"}},"keywordType":"QUERY","keyword":"${keyword}","time":"today 12-m"}&token=APP6_UEAAAAAZfCzq8z1gI3D2skBkYYKXy8wTGae2hvU`;
    const trendsRes = await fetch(trendsUrl);
    const trendsText = await trendsRes.text();

    // Limpieza de respuesta Google Trends
    const jsonText = trendsText.replace(")]}',", "");
    let trendsData;
    try {
      trendsData = JSON.parse(jsonText);
    } catch (err) {
      trendsData = null;
    }

    // 2️⃣ Mercado Libre (productos reales)
    const mlUrl = `https://api.mercadolibre.com/sites/MCO/search?q=${encodeURIComponent(keyword)}`;
    const mlRes = await fetch(mlUrl);
    const mlData = await mlRes.json();

    // 3️⃣ Google Imágenes (usa tu API key y motor)
    const googleApiKey = "AIzaSyCguPds0Dy0_Z6qnEWaq0NXrbHRwGgstG0";
    const cx = "55f45c50ecad74dfe";
    const imgUrl = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
      keyword
    )}&cx=${cx}&key=${googleApiKey}&searchType=image&num=5`;

    const imgRes = await fetch(imgUrl);
    const imgData = await imgRes.json();

    // 4️⃣ Armar resultados
    const results = [];

    if (mlData?.results?.length) {
      mlData.results.slice(0, 5).forEach((p, i) => {
        results.push({
          id: i + 1,
          title: p.title,
          price: p.price,
          link: p.permalink,
          image: p.thumbnail,
          source: "MercadoLibre",
        });
      });
    }

    if (imgData?.items?.length) {
      imgData.items.forEach((img, i) => {
        results.push({
          id: results.length + 1,
          title: img.title,
          image: img.link,
          context: img.image.contextLink,
          source: "Google Images",
        });
      });
    }

    if (trendsData?.default?.rankedList?.length) {
      const trendQueries =
        trendsData.default.rankedList[0]?.rankedKeyword || [];
      trendQueries.slice(0, 5).forEach((t, i) => {
        results.push({
          id: results.length + 1,
          title: t.query,
          score: t.value?.[0],
          source: "Google Trends",
        });
      });
    }

    // 5️⃣ Respuesta final
    res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      error: "Error general en el servidor",
      detalle: error.message,
    });
  }
}
