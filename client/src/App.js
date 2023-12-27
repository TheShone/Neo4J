import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './Layout';
import Register from './Pages/Register';
import Knjige from './Pages/Knjige';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route path = "/registration" element={<Register/>}/>
        <Route path = "/knjige" element={<Knjige/>}/>
      </Route>
    </Routes>
  );
}

export default App;
