<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>🔥 FUEGO Tendencias Reales</title>
  <style>
    body {
      font-family: "Lato", sans-serif;
      background-color: #121212;
      color: #f5f5f5;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }

    h1 {
      font-size: 2rem;
      margin-top: 2rem;
      color: #ff4b2b;
    }

    .search-container {
      margin: 2rem 0;
      display: flex;
      gap: 1rem;
    }

    input {
      padding: 0.7rem 1rem;
      border-radius: 8px;
      border: none;
      width: 260px;
    }

    button {
      background: linear-gradient(90deg, #ff4b2b, #ff416c);
      color: white;
      border: none;
      border-radius: 8px;
      padding: 0.7rem 1.2rem;
      cursor: pointer;
      font-weight: bold;
      transition: 0.3s;
    }

    button:hover {
      opacity: 0.9;
    }

    .results {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      gap: 1.5rem;
      width: 90%;
      max-width: 1000px;
    }

    .card {
      background: #1f1f1f;
      border-radius: 12px;
      padding: 1rem;
      box-shadow: 0 0 8px rgba(255, 75, 43, 0.2);
      text-align: center;
      transition: 0.3s;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 0 12px rgba(255, 75, 43, 0.4);
    }

    .card img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      border-radius: 8px;
      margin-bottom: 0.7rem;
    }

    .footer {
      margin-top: 2rem;
      font-size: 0.9rem;
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <h1>🔥 FUEGO: Tendencias Reales</h1>

  <div class="search-container">
    <input type="text" id="keyword" placeholder="Buscar tendencia..." />
    <button onclick="buscar()">Encender 🔥</button>
  </div>

  <div class="results" id="results"></div>

  <div class="footer">Hecho con 🔥 por el equipo FUEGO © 2025</div>

  <script>
    async function buscar() {
      const keyword = document.getElementById("keyword").value || "navidad";
      const url = `https://fuego-v7-real.vercel.app/api/trends?keyword=${encodeURIComponent(keyword)}&country=CO`;

      const res = await fetch(url);
      const data = await res.json();

      const container = document.getElementById("results");
      container.innerHTML = "";

      if (!data.ok || !data.results.length) {
        container.innerHTML = "<p>No se encontraron resultados 🔍</p>";
        return;
      }

      data.results.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          ${item.image ? `<img src="${item.image}" alt="${item.title}" />` : ""}
          <h3>${item.title}</h3>
          ${item.price ? `<p><strong>$${item.price}</strong></p>` : ""}
          ${item.link ? `<a href="${item.link}" target="_blank">Ver producto</a>` : ""}
          <p><small>${item.source}</small></p>
        `;
        container.appendChild(card);
      });
    }

    // Cargar por defecto
    buscar();
  </script>
</body>
</html>
