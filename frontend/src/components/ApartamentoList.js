import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ApartamentoList() {
  const [apartamentoList, setApartamentoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/apartamentos')
      .then(response => {
        setApartamentoList(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar apartamentos:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando apartamentos...</p>;

  return (
    <div>
      <h2>Apartamentos</h2>
      <button onClick={() => navigate('/reservas')} style={{ marginBottom: '20px' }}>
        Ver Reservas
      </button>

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        border: '1px solid #ccc',
        padding: '10px'
      }}>
        {apartamentoList.map((r, index) => (
          <div 
            key={index} 
            style={{ 
              borderBottom: '1px solid #ddd', 
              padding: '10px', 
              cursor: 'pointer' 
            }}
            onClick={() => navigate(`/apartamento/${r.apartment.id}/criar`)}

          >
            <p><strong>ID:</strong> {r.apartment.id} <strong> Título:</strong> {r.apartment.title}<strong> Local:</strong> {r.apartment.city} / {r.apartment.state}<strong> Max hóspedes:</strong> {r.apartment.max_guests}</p>
            <p><strong>Diária:</strong> R$ {r.apartment.daily_rate}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ApartamentoList;
