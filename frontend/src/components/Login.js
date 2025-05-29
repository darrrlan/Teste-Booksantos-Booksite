import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("http://localhost:5000/login", {
        params: {
          email: form.email,
          senha: form.senha,
        },
      });

      setErro(response.data.erro);

      if (response.status === 200) {
        if (response.data.redirect){
            window.location.href = response.data.redirect;
        }
        else{
            navigate('/apartamento');
        }
      }

    } catch (err) {
      const erro = err.response?.data?.erro || "Erro ao fazer login.";
      setErro(erro);
    }
  };

  return (
    <div className="criar-reserva">
      <h2>Login</h2>

      {erro && <p className="msg_erro">{erro}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="senha"
          placeholder="Senha"
          value={form.senha}
          onChange={handleChange}
          required
        />
        <button type="submit">Entrar</button>
        <button type="submit" onClick={() => navigate('/cadastro')}>Cadastro</button>
      </form>
    </div>
  );
}

export default Login;
