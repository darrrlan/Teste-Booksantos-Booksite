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

  if (loading) return <p>Carregando reservas...</p>;

  return (
    <div>
      <h2>Reservas</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>
          Cidade:
          <input
            type="text"
            value={cidade}
            onChange={e => setCidade(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Início:
          <input
            type="date"
            value={inicio}
            onChange={e => setInicio(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>
        <label style={{ marginLeft: '10px' }}>
          Fim:
          <input
            type="date"
            value={fim}
            onChange={e => setFim(e.target.value)}
            style={{ marginLeft: '5px' }}
          />
        </label>
        <button onClick={buscarReservasFiltradas} style={{ marginLeft: '10px' }}>
          Filtrar
        </button>
        <button onClick={() => {
          setCidade('');
          setInicio('');
          setFim('');
          buscarReservas();
        }} style={{ marginLeft: '10px' }}>
          Limpar Filtros
        </button>
      </div>

      <button onClick={() => navigate('/apartamentos')} style={{ marginBottom: '20px' }}>
        Ver Apartamentos
      </button>

      {reservas.length === 0 ? (
        <p>Nenhuma reserva encontrada.</p>
      ) : (
        reservas.map((r, index) => (
          <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <p><strong>Apartamento:</strong> {r.apartment.title} - {r.apartment.city}/{r.apartment.state}</p>
            <p><strong>Contato:</strong> {r.contact?.name || 'N/A'} ({r.contact?.email || 'N/A'})</p>
            <p><strong>Check-in:</strong> {r.reserva.checkin}</p>
            <p><strong>Check-out:</strong> {r.reserva.checkout}</p>
            <p><strong>Hóspedes:</strong> {r.reserva.guests}</p>
            <p><strong>Canal:</strong> {r.reserva.channel}</p>
            <p><strong>Total:</strong> R$ {r.reserva.total_price}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ReservaList;
