// src/components/ReservaList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ReservaList() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  axios.get('http://localhost:5000/reservas')
    .then(response => {
      console.log("Reservas recebidas:", response.data);
      setReservas(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error('Erro ao buscar reservas:', error);
      setLoading(false);
    });
}, []);


  if (loading) return <p>Carregando reservas...</p>;

  return (
    <div>
      <h2>Reservas</h2>
      {reservas.map((r, index) => (
        <div key={index} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
          <p><strong>Apartamento:</strong> {r.apartment.title} - {r.apartment.city}/{r.apartment.state}</p>
          <p><strong>Contato:</strong> {r.contact.name} ({r.contact.email})</p>
          <p><strong>Check-in:</strong> {r.reserva.checkin}</p>
          <p><strong>Check-out:</strong> {r.reserva.checkout}</p>
          <p><strong>Hóspedes:</strong> {r.reserva.guests}</p>
          <p><strong>Canal:</strong> {r.reserva.channel}</p>
          <p><strong>Total:</strong> R$ {r.reserva.total_price}</p>
        </div>
      ))}
    </div>
  );
}

export default ReservaList;
