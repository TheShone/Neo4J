import logo from './logo.svg';
import './App.css';
import { Route, Routes } from "react-router-dom";
import Layout from './Layout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        
      </Route>
    </Routes>
  );
}

export default App;