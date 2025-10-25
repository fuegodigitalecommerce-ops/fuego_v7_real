<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>🔥 FUEGO LATAM — Tendencias Reales</title>
  <style>
    :root{
      --bg:#0f1113;
      --card:#161719;
      --accent:#ff3b2e;
      --muted:#9aa3ad;
      color-scheme: dark;
    }
    html,body{height:100%;margin:0;font-family: "Lato", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;}
    body{background:var(--bg); color:#fff; display:flex; flex-direction:column; align-items:center; padding:28px;}
    header{max-width:1100px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px}
    h1{margin:0;font-size:20px;color:var(--accent)}
    p.lead{margin:0;color:var(--muted)}
    .search{margin:22px 0;display:flex;gap:10px;width:100%;max-width:1100px}
    input[type=text]{flex:1;padding:10px 14px;border-radius:8px;border:none;background:#0b0c0d;color:#fff;outline:none;box-shadow:inset 0 0 0 1px rgba(255,255,255,0.02)}
    button{background:linear-gradient(90deg,var(--accent),#ff6b59);border:0;padding:10px 16px;border-radius:8px;color:#fff;font-weight:700;cursor:pointer}
    #info{color:var(--muted);font-size:13px;margin-bottom:10px}
    .results{width:100%;max-width:1100px;display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:16px}
    .card{background:var(--card);border-radius:12px;padding:12px;box-shadow:0 6px 18px rgba(0,0,0,0.6);display:flex;flex-direction:column;gap:8px}
    .thumb{height:160px;border-radius:8px;object-fit:cover;background:#0b0c0d}
    .title{font-weight:700;font-size:15px;margin:0}
    .meta{color:var(--muted);font-size:13px}
    .price{color:#a6ffb5;font-weight:700}
    footer{margin-top:32px;color:var(--muted);font-size:13px}
    @media(max-width:520px){ .search{flex-direction:column} button{width:100%} }
  </style>
</head>
<body>
  <header>
    <div>
      <h1>🔥 Tendencias que están rompiendo en <span id="countryLabel">Latam</span></h1>
      <p class="lead">Busca por palabra clave y obtén hasta 50 resultados reales: tendencias, productos e imágenes.</p>
    </div>
    <div style="text-align:right">
      <small id="powered">Hecho con 🔥 por FUEGO © 2025</small>
    </div>
  </header>

  <div class="search">
    <input id="q" type="text" placeholder="Ej: navidad, celulares, decoración..." />
    <button id="btnSearch">Encender FUEGO</button>
  </div>

  <div id="info">Detectando país…</div>
  <div class="results" id="results"></div>

  <footer>
    <small>Optimizado para LATAM • Modo 100% real • Máx 50 resultados</small>
  </footer>

<script>
(async function init(){
  const resultsEl = document.getElementById('results');
  const info = document.getElementById('info');
  const countryLabel = document.getElementById('countryLabel');

  // Detectar país por IP (servidor Vercel añade x-vercel-ip-country; hacemos consulta fallback)
  let country = 'CO';
  // Primero intenta el header-based detection desde el servidor al pedir /api/trends?probe=1
  try{
    const r = await fetch('/api/trends?probe=1');
    if(r.ok){
      const j = await r.json();
      if(j.detectedCountry) country = j.detectedCountry;
    }
  }catch(e){ /* fallback abajo */ }

  // Fallback: usar geoip público cliente-side (rápido)
  if(!country){
    try{
      const r2 = await fetch('https://ipapi.co/json/');
      const j2 = await r2.json();
      if(j2 && j2.country) country = j2.country;
    }catch(e){}
  }

  countryLabel.textContent = country;
  info.textContent = `Buscando en: ${country} • ingresa una palabra y pulsa Encender FUEGO`;

  document.getElementById('btnSearch').onclick = buscar;
  // auto buscar navidad por defecto
  document.getElementById('q').value = 'navidad';
  buscar();

  async function buscar(){
    const q = document.getElementById('q').value || 'navidad';
    resultsEl.innerHTML = '<p style="grid-column:1/-1;color:#9aa3ad">Cargando resultados reales…</p>';
    try{
      const resp = await fetch(`/api/trends?keyword=${encodeURIComponent(q)}&country=${encodeURIComponent(country)}`);
      const json = await resp.json();
      if(!json.ok || !json.results || json.results.length===0){
        resultsEl.innerHTML = `<p style="grid-column:1/-1;color:#ffb3b3">No se encontraron resultados reales para "${q}" en ${country}.</p>`;
        return;
      }
      // ordenar: las tarjetas devueltas ya deben venir ordenadas, solo mostramos hasta 50
      resultsEl.innerHTML = '';
      json.results.slice(0,50).forEach(item=>{
        const card = document.createElement('div');
        card.className = 'card';
        const img = item.image ? `<img class="thumb" src="${item.image}" alt="${escapeHtml(item.title)}">` : '';
        const price = item.price ? `<div class="price">$${item.price.toLocaleString ? item.price.toLocaleString() : item.price}</div>` : '';
        const link = item.link ? `<a href="${item.link}" target="_blank">Ver producto</a>` : '';
        card.innerHTML = `
          ${img}
          <div>
            <div class="title">${escapeHtml(item.title)}</div>
            <div class="meta">${item.source || ''} ${item.score ? ' • score: '+item.score : ''}</div>
            ${price}
            <div style="margin-top:8px">${link}</div>
          </div>
        `;
        resultsEl.appendChild(card);
      });
    }catch(err){
      resultsEl.innerHTML = `<p style="grid-column:1/-1;color:#ffb3b3">Error al obtener resultados: ${err.message}</p>`;
    }
  }

  function escapeHtml(s){
    return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }

})();
</script>
</body>
</html>
