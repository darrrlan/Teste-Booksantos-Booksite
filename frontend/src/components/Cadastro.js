import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Cadastro() {
  const navigate = useNavigate();

  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    email: "",
    senha: "",
    name: "",
    phone: "",
    type: "",
    document: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email: form.email,
      senha: form.senha,
      name: form.name,
      phone: form.phone,
      type: form.type,
      document: form.document,
    };

    try {
      await axios.post("http://localhost:5000/cadastro", payload);
      navigate("/reservas");
    } catch (err) {
      console.error("Erro ao criar cadastro:", err);
      const mensagem = err.response?.data?.erro || "Erro ao criar cadastro.";
      setErro(mensagem);
    }
  };

  return (
    <div className="criar-reserva">
      <h2>Criar Login</h2>

      {erro && <div className="msg_erro">{erro}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="senha"
          placeholder="Senha"
          type="password"
          value={form.senha}
          onChange={handleChange}
        />
        <input
          name="name"
          placeholder="Nome"
          value={form.name}
          onChange={handleChange}
        />
        <input
          name="phone"
          placeholder="Telefone"
          value={form.phone}
          onChange={handleChange}
        />
        <select
          name="type"
          placeholder="Tipo"
          value={form.type}
          onChange={handleChange}
        >
          <option value="">Tipo</option>
          <option value="individual">Individual</option>
          <option value="company">Company</option>
        </select>
        <input
          name="document"
          placeholder="Documento"
          value={form.document}
          onChange={handleChange}
        />
        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
}

export default Cadastro;
