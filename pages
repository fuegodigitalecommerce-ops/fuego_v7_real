import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("CO");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!keyword.trim()) return alert("🔥 Escribe una palabra clave primero!");
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const res = await fetch(`/api/trends?keyword=${keyword}&country=${country}`);
      const data = await res.json();
      if (data.ok) setResults(data.results);
      else setError(data.error || "No se encontraron resultados");
    } catch (e) {
      setError("Error al conectar con el servidor");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", textAlign: "center", padding: "2rem" }}>
      <h1>🔥 FUEGO LATAM 🔥</h1>
      <p>Descubre los productos en tendencia en tu país</p>

      <div style={{ margin: "1rem" }}>
        <input
          type="text"
          placeholder="Ej: navidad, moda, hogar..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", marginRight: "10px" }}
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ padding: "10px", borderRadius: "6px", marginRight: "10px" }}
        >
          <option value="CO">🇨🇴 Colombia</option>
          <option value="AR">🇦🇷 Argentina</option>
          <option value="MX">🇲🇽 México</option>
          <option value="CL">🇨🇱 Chile</option>
          <option value="PE">🇵🇪 Perú</option>
        </select>

        <button onClick={handleSearch} style={{ padding: "10px 15px", background: "red", color: "white", borderRadius: "6px", cursor: "pointer" }}>
          Encender FUEGO
        </button>
      </div>

      {loading && <p>🔥 Buscando tendencias...</p>}
      {error && <p style={{ color: "orange" }}>{error}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px", marginTop: "20px" }}>
        {results.map((item, i) => (
          <div key={i} style={{ background: "#111", padding: "1rem", borderRadius: "8px", width: "250px" }}>
            <img src={item.image} alt={item.title} style={{ width: "100%", borderRadius: "8px" }} />
            <h3>{item.title}</h3>
            <p>💰 {item.price ? `$${item.price}` : "Precio no disponible"}</p>
            <p>📦 {item.source}</p>
            <p>👤 {item.seller}</p>
            <a href={item.link} target="_blank" style={{ color: "yellow" }}>
              Ver producto 🔗
            </a>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: "3rem" }}>
        Hecho con 🔥 por el equipo FUEGO © 2025
      </footer>
    </div>
  );
}
