// index.js
export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).end(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <title>🔥 FUEGO LATAM 🔥</title>
      <style>
        body {
          background-color: #111;
          color: #fff;
          font-family: Arial, sans-serif;
          text-align: center;
          padding-top: 100px;
        }
        input, button {
          padding: 10px;
          border-radius: 8px;
          border: none;
          margin: 5px;
          font-size: 16px;
        }
        button {
          background-color: red;
          color: white;
          cursor: pointer;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          background: #222;
          margin: 6px auto;
          width: fit-content;
          padding: 6px 12px;
          border-radius: 6px;
        }
      </style>
    </head>
    <body>
      <h1>🔥 FUEGO LATAM 🔥</h1>
      <p>Descubre los productos en tendencia en tu país</p>
      <form onsubmit="buscar(event)">
        <input type="text" id="keyword" placeholder="Ej: navidad, moda, hogar..." required />
        <input type="text" id="country" value="CO" maxlength="2" />
        <button type="submit">Encender FUEGO</button>
      </form>
      <div id="resultados"></div>
      <script>
        async function buscar(e) {
          e.preventDefault();
          const keyword = document.getElementById('keyword').value;
          const country = document.getElementById('country').value;
          const r = await fetch(\`/api/trends?keyword=\${keyword}&country=\${country}\`);
          const data = await r.json();
          const out = data.results?.length
            ? data.results.map(t => '<li>' + t.title + '</li>').join('')
            : '<p>Sin resultados disponibles.</p>';
          document.getElementById('resultados').innerHTML = '<ul>' + out + '</ul>';
        }
      </script>
      <p>Hecho con 🔥 por el equipo FUEGO © 2025</p>
    </body>
    </html>
  `);
}
