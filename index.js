export default function Home() {
  return `
    <html>
      <head>
        <title>🔥 FUEGO LATAM</title>
        <style>
          body { background: #111; color: white; text-align: center; font-family: Arial; }
          input, button { padding: 10px; margin: 10px; border-radius: 5px; }
          button { background: #ff4040; color: white; border: none; cursor: pointer; }
        </style>
      </head>
      <body>
        <h1>🔥 FUEGO LATAM 🔥</h1>
        <p>Descubre los productos en tendencia en tu país</p>
        <form onsubmit="buscar(event)">
          <input id="keyword" placeholder="Ej: navidad, moda..." />
          <input id="country" value="CO" />
          <button>Encender FUEGO</button>
        </form>
        <div id="resultados"></div>
        <script>
          async function buscar(e) {
            e.preventDefault();
            const keyword = document.getElementById('keyword').value;
            const country = document.getElementById('country').value;
            const res = await fetch('/api/trends?keyword=' + keyword + '&country=' + country);
            const data = await res.json();
            document.getElementById('resultados').innerHTML =
              '<pre>' + JSON.stringify(data, null, 2) + '</pre>';
          }
        </script>
      </body>
    </html>
  `;
}
