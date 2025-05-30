import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/dashboard')
      .then(response => {
        setDados(response.data[0].Informações);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar dados do dashboard:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading">Carregando dados do dashboard...</p>;
  if (!dados) return <p className="error">Dados não encontrados.</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total de Reservas</h3>
          <p className="valor">{dados.total_reserva}</p>
        </div>
        <div className="dashboard-card">
          <h3>Faturamento Airbnb</h3>
          <p className="valor">R$ {dados.total_price_airbnb}</p>
        </div>
        <div className="dashboard-card">
          <h3>Faturamento Booking</h3>
          <p className="valor">R$ {dados.total_price_booking}</p>
        </div>
        <div className="dashboard-card">
          <h3>Faturamento Direto</h3>
          <p className="valor">R$ {dados.total_price_direto}</p>
        </div>
      </div>

      <div className="dashboard-card">
        <h3>Cidades com Mais Reservas</h3>
        <ul className="lista">
          {dados.cidades_mais_reservas.slice(0,5).map((c, index) => (
            <li key={index} className="item-lista">
              {c.cidade}: {c.total_reservas} reservas
            </li>
          ))}
        </ul>
      </div>
      <button type="submit" onClick={() => navigate('/reservas')}>Resevas</button>
    </div>
  );
}

export default Dashboard;
