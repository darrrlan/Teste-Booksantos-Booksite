import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

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

  if (loading) return <p>Carregando dados do dashboard...</p>;
  if (!dados) return <p>Dados não encontrados.</p>;

  return (
    <div>
      <h2>Dashboard</h2>
      <div style={{ marginBottom: '20px' }}>
        <h3>Total de Reservas no Mês: {dados.total_reserva}</h3>
        <p><strong>Faturamento Airbnb:</strong> R$ {dados.total_price_airbnb}</p>
        <p><strong>Faturamento Booking.com:</strong> R$ {dados.total_price_booking}</p>
        <p><strong>Faturamento Direto:</strong> R$ {dados.total_price_direto}</p>
      </div>

      <h3>Cidades com Mais Reservas no Último Mês</h3>
      <ul>
        {dados.cidades_mais_reservas.map((c, index) => (
          <li key={index}>
            {c.cidade}: {c.total_reservas} reservas
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
