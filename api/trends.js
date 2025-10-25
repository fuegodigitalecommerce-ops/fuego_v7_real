// api/trends.js
import fetch from "node-fetch";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "AIzaSyCguPds0Dy0_Z6qnEWaq0NXrbHRwGgstG0";
const GOOGLE_CX = process.env.GOOGLE_CX || "55f45c50ecad74dfe";

// Helper: detect country from Vercel header or fallback to ipapi
async function detectCountry(req){
  const header = (req.headers['x-vercel-ip-country'] || req.headers['x-country'] || req.headers['cf-ipcountry']);
  if(header) return header.toUpperCase();
  // try query param probe (client-side)
  if(req.query && req.query.country) return req.query.country.toUpperCase();
  // fallback to ipapi
  try{
    const r = await fetch('https://ipapi.co/json/');
    const j = await r.json();
    if(j && j.country) return j.country.toUpperCase();
  }catch(e){}
  return 'CO';
}

// Get tokens and widgets from Google Trends explore endpoint
async function getTrendsWidgets(keyword, geo){
  try{
    const reqBody = {
      comparisonItem: [{ keyword, geo: geo === 'LATAM' ? '' : geo, time: "today 12-m" }],
      category: 0,
      property: ""
    };
    const url = `https://trends.google.com/trends/api/explore?hl=es-419&tz=-300&req=${encodeURIComponent(JSON.stringify(reqBody))}`;
    const res = await fetch(url, { headers: { "User-Agent":"Mozilla/5.0 (FUEGO/1.0)" }});
    let txt = await res.text();
    txt = txt.replace(/^[\)\]\}'\s]+/, "").trim();
    const jsonStart = txt.indexOf("{");
    if(jsonStart === -1) return null;
    const json = JSON.parse(txt.slice(jsonStart));
    return json.widgets || null;
  }catch(e){
    return null;
  }
}

// Fetch widget data by widget query
async function fetchWidgetData(widget){
  try{
    const url = widget.request && widget.request.path ? `https://trends.google.com${widget.request.path}` : null;
    if(!url) return null;
    const res = await fetch(url, { headers: { "User-Agent":"Mozilla/5.0 (FUEGO/1.0)" }});
    let txt = await res.text();
    if(!txt) return null;
    txt = txt.replace(/^[\)\]\}'\s]+/, "").trim();
    const idx = txt.indexOf("{");
    if(idx===-1) return null;
    const j = JSON.parse(txt.slice(idx));
    return j;
  }catch(e){
    return null;
  }
}

export default async function handler(req, res){
  try{
    // probe flag: return detectedCountry for client-side auto-detect
    if(req.query && req.query.probe){
      const detectedCountry = await detectCountry(req);
      return res.status(200).json({ ok:true, detectedCountry });
    }

    const keyword = (req.query.keyword || "navidad").trim();
    let country = (req.query.country || '').toString().trim().toUpperCase();
    if(!country) country = await detectCountry(req);
    if(country==='LATAM') country = ''; // use empty for region wide if set

    // 1) Try Google Trends (explore -> widgets -> widgetdata)
    let results = [];
    const widgets = await getTrendsWidgets(keyword, country || '');
    if(widgets && Array.isArray(widgets)){
      // find related searches widget or similar
      const relatedWidget = widgets.find(w => (w.id && w.id.toLowerCase().includes('related')) ) || widgets[0];
      if(relatedWidget){
        const widgetData = await fetchWidgetData(relatedWidget);
        const ranked = widgetData?.default?.rankedList?.[0]?.rankedKeyword || [];
        ranked.slice(0, 20).forEach((k,i)=>{
          results.push({
            id: results.length+1,
            title: k.topic?.title || k.query || String(k),
            score: k.value ? (Array.isArray(k.value)? k.value[0] : k.value) : 0,
            source: "Google Trends",
            type: "trend"
          });
        });
      }
    }

    // 2) MercadoLibre search (fetch up to 50)
    // Map country to ML site code
    const meliMap = { CO: "MCO", MX: "MLM", AR: "MLA", CL: "MLC", PE: "MPE", UY: "MLU", EC: "MEC" };
    const site = meliMap[country] || ("MCO");
    try{
      const mlUrl = `https://api.mercadolibre.com/sites/${site}/search?q=${encodeURIComponent(keyword)}&limit=50`;
      const mlRes = await fetch(mlUrl);
      const mlJson = await mlRes.json();
      if(Array.isArray(mlJson.results)){
        // prioritize by sold_quantity if available, else follow API order
        const mlItems = mlJson.results.slice(0,50).map((p,i)=>({
          id: results.length+1,
          title: p.title,
          price: p.price,
          image: p.thumbnail,
          link: p.permalink,
          sold_quantity: p.sold_quantity || 0,
          source: "MercadoLibre",
          type: "product"
        }));
        // sort by sold_quantity desc, then push
        mlItems.sort((a,b)=> (b.sold_quantity||0) - (a.sold_quantity||0));
        mlItems.forEach(it=> results.push(it));
      }
    }catch(e){
      // ignore ML failure
    }

    // 3) Google Images (Custom Search) — up to 20 images
    if(GOOGLE_API_KEY && GOOGLE_API_KEY !== "REPLACE_WITH_YOUR_GOOGLE_KEY" && GOOGLE_CX && GOOGLE_CX !== "REPLACE_WITH_YOUR_CX"){
      try{
        const imgUrl = `https://customsearch.googleapis.com/customsearch/v1?q=${encodeURIComponent(keyword)}&cx=${GOOGLE_CX}&key=${GOOGLE_API_KEY}&searchType=image&num=20`;
        const imgRes = await fetch(imgUrl);
        const imgJson = await imgRes.json();
        const items = imgJson.items || [];
        items.slice(0,20).forEach(it=>{
          results.push({
            id: results.length+1,
            title: it.title || keyword,
            image: it.link,
            context: it.image?.contextLink,
            source: "Google Images",
            type: "image"
          });
        });
      }catch(e){
        // ignore image failures
      }
    }

    // Final ordering heuristics:
    // - All MercadoLibre products (type product) first, sorted by sold_quantity (already)
    // - Then Google Trends (type trend) by score desc
    // - Then Google Images
    const products = results.filter(r=>r.type==='product');
    const trends = results.filter(r=>r.type==='trend').sort((a,b)=> (b.score||0)-(a.score||0));
    const images = results.filter(r=>r.type==='image');

    const final = [...products, ...trends, ...images].slice(0,50);

    return res.status(200).json({
      ok: true,
      keyword,
      country,
      resultsCount: final.length,
      results: final
    });

  }catch(err){
    console.error("FUEGO /api/trends error:", err);
    return res.status(500).json({ ok:false, error: "Error interno", detalle: err.message });
  }
}
