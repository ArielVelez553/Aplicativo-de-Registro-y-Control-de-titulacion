
// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./Users/Index";
import Login from "./Server/Login";
import Registro from "./Server/Registro";
import InterfazPrincipal from "./Users/InterfazPrincipal";
import OpcionTema from "./Users/OpcionTema";
import RegistrarTrabajo from "./Users/Registrartrabajo";
import Avances from "./Users/Avances";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro/>} />
        <Route path="/interfazprincipal" element={<InterfazPrincipal/>}/>
        <Route path="/opciontema" element={<OpcionTema/>}/>
        <Route path="/registrartrabajo" element={<RegistrarTrabajo/>}/> 
        <Route path="/avances" element={<Avances/>}/>
      </Routes>
    </Router>
  );
} 

export default App;
