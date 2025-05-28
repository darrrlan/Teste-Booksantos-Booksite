import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ReservaList from './components/ReservaList';
import ApartamentoList from './components/ApartamentoList';
import CriarReserva from './components/CriarReserva';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ReservaList />} />
        <Route path="/apartamentos" element={<ApartamentoList />} />
         <Route path="/reservas" element={<ReservaList />} />
         <Route path="/apartamento/:id/criar" element={<CriarReserva />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
