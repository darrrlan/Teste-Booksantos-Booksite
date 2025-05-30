import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ApartamentoList() {
  const [apartamentoList, setApartamentoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cidade, setCidade] = useState("");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const navigate = useNavigate();

  function capitalizeWords(str) {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const buscarApartamentos = () => {
    setLoading(true);
    axios
      .get("http://localhost:5000/apartamentos")
      .then((response) => {
        setApartamentoList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar apartamentos:", error);
        setLoading(false);
      });
  };

  const buscarApartamentosFiltrados = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cidade) params.append("cidade", cidade);
    if (inicio) params.append("inicio", inicio);
    if (fim) params.append("fim", fim);

    axios
      .get(`http://localhost:5000/filtro_sem_reserva?${params.toString()}`)
      .then((response) => {
        setApartamentoList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar apartamentos filtrados:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarApartamentos();
  }, []);

  if (loading) return

  return (
    <div>
      <h1>Alugar Apartamento</h1>

      <div className="filtro-container">
        <label>
          Cidade:
          <input 
            type="text"
            value={capitalizeWords(cidade)}
            onChange={(e) => setCidade(e.target.value)}
            className="filtro-input"
          />
        </label>
        <label className="filtro-label">
          Início:
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="filtro-input"
          />
        </label>
        <label className="filtro-label">
          Fim:
          <input
            type="date"
            value={fim}
            onChange={(e) => setFim(e.target.value)}
            className="filtro-input"
          />
        </label>
        <button onClick={buscarApartamentosFiltrados} className="filtro-button">
          Filtrar
        </button>
        <button
          onClick={() => {
            setCidade("");
            setInicio("");
            setFim("");
            buscarApartamentos();
          }}
          className="filtro-button"
        >
          Limpar Filtros
        </button>
      </div>

      <div className="grid-container">
        {apartamentoList.map((r, index) => (
          <div className="reserva-card"
            key={index}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              margin: "10px",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/apartamento/${r.apartment.id}/criar`)}
          >
            <h2>{r.apartment.title}</h2>
            <h4 className="Cidade_estado">
              {r.apartment.city} / {r.apartment.state}
            </h4>
            <h3 >
               {r.apartment.max_guests} hóspedes&nbsp;&nbsp;&nbsp;&nbsp;Diária: R$ {r.apartment.daily_rate}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApartamentoList;
