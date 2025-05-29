// src/components/CriarReserva.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function CriarReserva() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apartamentos, setApartamentos] = useState([]);
  const [contatos, setContatos] = useState([]);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    apartment_id: "",
    contact_id: "",
    checkin: "",
    checkout: "",
    guests: "",
    channel: "",
  });

  useEffect(() => {
    axios.get("http://localhost:5000/apartamentos").then((res) => setApartamentos(res.data));
    axios.get("http://localhost:5000/contatos").then((res) => setContatos(res.data));

    if (id) {
      setForm((prev) => ({ ...prev, apartment_id: id }));
    }
  }, [id]);

  function calcularTotalDias(checkin, checkout) {
    const inicio = new Date(checkin);
    const fim = new Date(checkout);
    const diffTime = fim - inicio;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return isNaN(diffDays) || diffDays <= 0 ? 0 : diffDays;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErro("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dias = calcularTotalDias(form.checkin, form.checkout);
    if (dias === 0) {
      setErro("O período da reserva é inválido.");
      return;
    }

    const apartamento = apartamentos.find(
      (a) => a.apartment.id === parseInt(form.apartment_id)
    );
    const dailyRate = apartamento?.apartment.daily_rate || 0;
    const total_price = dailyRate * dias;

    const payload = {
      apartment_id: form.apartment_id,
      contact_id: form.contact_id,
      checkin: form.checkin,
      checkout: form.checkout,
      guests: form.guests,
      channel: form.channel,
      total_price,
    };

    try {
      await axios.post("http://localhost:5000/criarreserva", payload);
      navigate("/reservas");
    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      const mensagem = err.response?.data?.erro || "Erro ao criar reserva.";
      setErro(mensagem);
    }
  };

  return (
    <div className="criar-reserva">
      <h2>Criar Reserva</h2>

      {erro && (
        <div className="msg_erro">
          {erro}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input type="hidden" name="apartment_id" value={form.apartment_id} />

        <label>Contato:</label>
        <select
          name="contact_id"
          value={form.contact_id}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          {contatos.map((c, i) => (
            <option key={i} value={c.contact.id}>
              {c.contact.name} - {c.contact.email}
            </option>
          ))}
        </select>

        <label>Check-in:</label>
        <input
          type="date"
          name="checkin"
          value={form.checkin}
          onChange={handleChange}
          required
        />

        <label>Check-out:</label>
        <input
          type="date"
          name="checkout"
          value={form.checkout}
          onChange={handleChange}
          required
        />

        <label>Hóspedes:</label>
        <input
          type="number"
          name="guests"
          value={form.guests}
          onChange={handleChange}
          required
          min="1"
        />

        <label>Canal:</label>
        <select
          name="channel"
          value={form.channel}
          onChange={handleChange}
          required
        >
          <option value="">Selecione</option>
          <option value="airbnb">Airbnb</option>
          <option value="booking.com">Booking.com</option>
          <option value="direto">Direto</option>
        </select>

        <button type="submit">Criar Reserva</button>
      </form>
    </div>
  );
}

export default CriarReserva;
