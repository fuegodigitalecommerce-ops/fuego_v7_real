// /pages/index.js
import { useState } from "react";

export default function Home() {
  const [keyword, setKeyword] = useState("");
  const [country, setCountry] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!keyword || !country) return alert("Por favor escribe una palabra y selecciona un país 🔥");
    setLoading(true);
    setResults([]);
    try {
      const response = await fetch(`/api/trends?keyword=${encodeURIComponent(keyword)}&country=${country}`);
      const data = await response.json();
      if (data.ok && data.results.length > 0) {
        setResults(data.results);
      } else {
        alert("No se encontraron resultados 🔎");
      }
    } catch (err) {
      alert("Error al obtener datos 😥");
    }
    setLoading(false);
  };

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh", textAlign: "center", padding: "40px" }}>
      <h1 style={{ fontSize: "2.5rem", marginBottom: "10px" }}>🔥 FUEGO LATAM 🔥</h1>
      <p style={{ fontSize: "1.1rem", marginBottom: "25px" }}>
        Descubre los productos en tendencia en tu país
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap", marginBottom: "25px" }}>
        <input
          type="text"
          placeholder="Ej: navidad, moda, hogar..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            width: "220px",
            outline: "none"
          }}
        />

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          style={{
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            width: "120px",
            outline: "none"
          }}
        >
          <option value="">Seleccionar país</option>
          <option value="AR">Argentina</option>
          <option value="BO">Bolivia</option>
          <option value="BR">Brasil</option>
          <option value="CL">Chile</option>
          <option value="CO">Colombia</option>
          <option value="CR">Costa Rica</option>
          <option value="CU">Cuba</option>
          <option value="DO">Rep. Dominicana</option>
          <option value="EC">Ecuador</option>
          <option value="MX">México</option>
          <option value="PA">Panamá</option>
          <option value="PE">Perú</option>
          <option value="PY">Paraguay</option>
          <option value="UY">Uruguay</option>
          <option value="VE">Venezuela</option>
        </select>

        <button
          onClick={buscar}
          style={{
            background: "#ff1c1c",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          {loading ? "Buscando..." : "Encender FUEGO"}
        </button>
      </div>

      {results.length > 0 && (
        <div>
          <h2 style={{ marginBottom: "20px" }}>🔥 Tendencias que están rompiendo en {country} 🔥</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            padding: "20px"
          }}>
            {results.map((item) => (
              <div key={item.id} style={{
                background: "#111",
                borderRadius: "10px",
                padding: "15px",
                textAlign: "left",
                boxShadow: "0 0 10px rgba(255,255,255,0.1)"
              }}>
                <h3 style={{ color: "#ffcc00" }}>{item.title}</h3>
                <p style={{ color: "#ccc", fontSize: "0.9rem" }}>{item.snippet}</p>
                <a href={item.link} target="_blank" rel="noopener noreferrer" style={{ color: "#1e90ff" }}>
                  Ver más 🔗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer style={{ marginTop: "30px", fontSize: "0.9rem", color: "#aaa" }}>
        Hecho con 🔥 por el equipo FUEGO © 2025
      </footer>
    </div>
  );
}
