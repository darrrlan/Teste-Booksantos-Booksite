import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ReservaList() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cidade, setCidade] = useState('');
  const [inicio, setInicio] = useState('');
  const [fim, setFim] = useState('');
  const navigate = useNavigate();

  const buscarReservas = () => {
    setLoading(true);
    axios.get('http://localhost:5000/reservas')
      .then(response => {
        setReservas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar reservas:', error);
        setLoading(false);
      });
  };

  const buscarReservasFiltradas = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (cidade) params.append('cidade', cidade);
    if (inicio) params.append('inicio', inicio);
    if (fim) params.append('fim', fim);

    axios.get(`http://localhost:5000/filtro?${params.toString()}`)
      .then(response => {
        setReservas(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar reservas filtradas:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    buscarReservas();
  }, []);

  if (loading) return

  return (
  <div className="reserva-list-container">
    <h2>Reservas</h2>

    <div className="filtro-container">
      <label>
        Cidade:
        <input
          type="text"
          value={cidade}
          onChange={e => setCidade(e.target.value)}
          className="filtro-input"
        />
      </label>

      <label>
        Início:
        <input
          type="date"
          value={inicio}
          onChange={e => setInicio(e.target.value)}
          className="filtro-input"
        />
      </label>

      <label>
        Fim:
        <input
          type="date"
          value={fim}
          onChange={e => setFim(e.target.value)}
          className="filtro-input"
        />
      </label>

      <button onClick={buscarReservasFiltradas} className="filtro-button">
        Filtrar
      </button>

      <button
        onClick={() => {
          setCidade('');
          setInicio('');
          setFim('');
          buscarReservas();
        }}
        className="filtro-button limpar-button"
      >
        Limpar Filtros
      </button>
    </div>

    {loading && <p className="loading-text">Carregando reservas...</p>}

    {!loading && reservas.length === 0 && (
      <p className="no-reservas">Nenhuma reserva encontrada.</p>
    )}

    {!loading && reservas.length > 0 && reservas.map((r, index) => (
      <div key={index} className="reserva-card">
        <p><strong>Apartamento:</strong> {r.apartment.title} - {r.apartment.city}/{r.apartment.state}</p>
        <p><strong>Contato:</strong> {r.contact?.name || 'N/A'} ({r.contact?.email || 'N/A'})</p>
        <p><strong>Check-in:</strong> {r.reserva.checkin}</p>
        <p><strong>Check-out:</strong> {r.reserva.checkout}</p>
        <p><strong>Hóspedes:</strong> {r.reserva.guests}</p>
        <p><strong>Canal:</strong> {r.reserva.channel}</p>
        <p><strong>Total:</strong> R$ {r.reserva.total_price}</p>
      </div>
    ))}

    <button type="submit" onClick={() => navigate('/dashboard')} className="dashboard-button">
      Dashboard
    </button>
  </div>
);

}

export default ReservaList;
