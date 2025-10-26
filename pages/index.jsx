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
      if (data.ok && data.results.length > 0) {
        setResults(data.results);
      } else {
        setError("🔍 No se encontraron resultados");
      }
    } catch (e) {
      setError("⚠️ Error al conectar con el servidor");
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        minHeight: "100vh",
        backgroundColor: "#111",
        color: "white",
        paddingTop: "80px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>🔥 FUEGO LATAM 🔥</h1>
      <p>Descubre los productos en tendencia en tu país</p>

      <input
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Ej: navidad, moda, hogar..."
        style={{
          padding: "10px",
          borderRadius: "6px",
          marginRight: "10px",
          border: "none",
          width: "240px",
        }}
      />

      <select
        value={country}
        onChange={(e) => setCountry(e.target.value)}
        style={{
          padding: "10px",
          borderRadius: "6px",
          border: "none",
          marginRight: "10px",
        }}
      >
        <option value="">🌎 Seleccionar país</option>
        <option value="CO">🇨🇴 Colombia</option>
        <option value="MX">🇲🇽 México</option>
        <option value="AR">🇦🇷 Argentina</option>
        <option value="CL">🇨🇱 Chile</option>
        <option value="PE">🇵🇪 Perú</option>
      </select>

      <button
        onClick={handleSearch}
        style={{
          padding: "10px 18px",
          borderRadius: "6px",
          border: "none",
          backgroundColor: "#ff3333",
          color: "white",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Encender FUEGO
      </button>

      <div style={{ marginTop: "40px" }}>
        {loading && <p>🔥 Buscando tendencias...</p>}
        {error && <p>{error}</p>}
        {results.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#222",
              margin: "10px auto",
              width: "90%",
              maxWidth: "600px",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#ffcc00",
                textDecoration: "none",
                fontWeight: "bold",
              }}
            >
              {item.title}
            </a>
            {item.image && (
              <div>
                <img
                  src={item.image}
                  alt={item.title}
                  style={{
                    width: "100%",
                    borderRadius: "10px",
                    marginTop: "10px",
                  }}
                />
              </div>
            )}
            <p style={{ color: "#aaa", marginTop: "5px" }}>
              Fuente: {item.source}
            </p>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: "50px", color: "#888" }}>
        Hecho con 🔥 por el equipo <strong>FUEGO</strong> © 2025
      </footer>
    </div>
  );
}
