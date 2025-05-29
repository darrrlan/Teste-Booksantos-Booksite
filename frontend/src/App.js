import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReservaList from './components/ReservaList';
import ApartamentoList from './components/ApartamentoList';
import CriarReserva from './components/CriarReserva';
import Dashboard from './components/Dashboard';
import Cadastro from './components/Cadastro';
import Login from './components/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReservaList />} />
        <Route path="/apartamentos" element={<ApartamentoList />} />
        <Route path="/reservas" element={<ReservaList />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login />} />
        <Route path ="/apartamento" element={<ApartamentoList/>}/>
        <Route path="/apartamento/:id/criar" element={<CriarReserva />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
