export default function Home() {
  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", background: "#000", color: "#fff", minHeight: "100vh", paddingTop: "50px" }}>
      <h1>🔥 FUEGO LATAM 🔥</h1>
      <p>Descubre los productos en tendencia en tu país</p>
      <form action="/api/trends" method="get">
        <input name="keyword" placeholder="Ej: navidad, moda, hogar..." style={{ padding: "10px", width: "200px", marginRight: "10px" }} />
        <input name="country" placeholder="CO" style={{ padding: "10px", width: "60px", marginRight: "10px" }} />
        <button type="submit" style={{ background: "red", color: "#fff", padding: "10px" }}>Encender FUEGO</button>
      </form>
      <footer style={{ marginTop: "50px" }}>Hecho con 🔥 por el equipo FUEGO © 2025</footer>
    </div>
  );
}
