import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './Layout';
import Register from './Pages/Register';
import Knjige from './Pages/Knjige';
import axios from "axios";
import { UserContextProvider } from "./UserContext.js";
import Login from './Pages/Login.js';
import Pisci from './Pages/AdminPisci.js';
import "bootstrap/dist/css/bootstrap.min.css";
import AdminPisac from './Pages/AdminPisac.js';
import Profil from './Pages/Profil.js';
import AdminIzdavaci from './Pages/AdminIzdavaci.js';
import AdminZanr from './Pages/AdminZanr.js';
import Knjiga from './Pages/Knjiga.js';
import IznajmljeneKnjige from './Pages/IznajmljeneKnjige.js';
import Index from './Pages/Index.js';
axios.defaults.baseURL = "http://localhost:5002";
axios.defaults.withCredentials = true;
function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Index/>} />
        <Route path = "/registration" element={<Register/>}/>
        <Route path = "/knjige" element={<Knjige/>}/>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/pisci" element={<Pisci/>}></Route>
        <Route path="/pisac/:id" element={<AdminPisac/>}></Route>
        <Route path="/profil" element={<Profil/>}></Route>
        <Route path="/izdavaci" element={<AdminIzdavaci/>}></Route>
        <Route path="/zanri" element={<AdminZanr/>}></Route>
        <Route path="/knjiga/:id" element={<Knjiga/>}></Route>
        <Route path="/iznajmljeneKnjige" element={<IznajmljeneKnjige/>}></Route>
      </Route>
    </Routes>
    </UserContextProvider>
  );
}

export default App;
