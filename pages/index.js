import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrends = async () => {
    setLoading(true);
    setError(null);
    setResults([]);

    try {
      const res = await fetch(`/api/trends?keyword=${keyword}&country=${country}`);
      const data = await res.json();

      if (!data.ok) throw new Error(data.error || "Error al obtener resultados");
      setResults(data.results || []);
    } catch (err) {
      console.error("Error al cargar tendencias:", err);
      setError("No se pudieron cargar las tendencias 😔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      backgroundColor: "#000",
      color: "#fff",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <h1>🔥 FUEGO LATAM 🔥</h1>
      <p>Descubre los productos en tendencia en tu país</p>

      <div style={{ display: "flex", gap: "10px", margin: "20px" }}>
        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Ej: navidad, moda..."
          style={{ padding: "10px", borderRadius: "5px", width: "220px" }}
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{ padding: "10px", borderRadius: "5px" }}
        >
          <option value="">Seleccionar país</option>
          <option value="CO">Colombia 🇨🇴</option>
          <option value="MX">México 🇲🇽</option>
          <option value="AR">Argentina 🇦🇷</option>
          <option value="CL">Chile 🇨🇱</option>
          <option value="PE">Perú 🇵🇪</option>
          <option value="EC">Ecuador 🇪🇨</option>
          <option value="VE">Venezuela 🇻🇪</option>
          <option value="PA">Panamá 🇵🇦</option>
          <option value="DO">Rep. Dominicana 🇩🇴</option>
        </select>

        <button
          onClick={fetchTrends}
          style={{
            padding: "10px 20px",
            backgroundColor: "red",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Encender FUEGO
        </button>
      </div>

      {loading && <p>🔥 Buscando tendencias...</p>}
      {error && <p>{error}</p>}

      <div style={{ marginTop: "20px", maxWidth: "600px", textAlign: "center" }}>
        {results.length > 0 ? (
          results.map((item, i) => (
            <div key={i} style={{
              backgroundColor: "#222",
              borderRadius: "8px",
              margin: "10px 0",
              padding: "10px"
            }}>
              <h3>{item.title}</h3>
              {item.link && (
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: "#0af" }}>
                  Ver más 🔗
                </a>
              )}
            </div>
          ))
        ) : (
          !loading && <p>No hay resultados todavía 🔍</p>
        )}
      </div>

      <footer style={{ marginTop: "30px", fontSize: "14px", color: "#aaa" }}>
        Hecho con 🔥 por el equipo FUEGO © 2025
      </footer>
    </div>
  );
}
