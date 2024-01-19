import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";
import Cookies from "js-cookie";
import { Navigate } from "react-router-dom";


const Header = () => {
  const config = {
    headers: { Authorization: `Bearer ${Cookies.get("Token")}` },
  };
  const { ready, user, setUser } = useContext(UserContext);
  const [redirect, setRedirect] = useState(null);
  
  const handleLogout = async () => {
    axios
      .post("/Login/LogOut", {}, config)
      .then(() => {
        setRedirect(true);
        setUser(null);
      })
      .catch((err) => {
        console.log("Error:" + err.message);
      });
  };
  return (
    <header id="header" class="fixed-top ">
    <div class="container d-flex align-items-center justify-content-lg-between my-1">

      <h1 class="logo me-auto me-lg-0"><a><Link to="/">Biblioteka</Link></a></h1>
      <a href="index.html" class="logo me-auto me-lg-0"><img src="assets/img/logo.png" alt="" class="img-fluid"/></a>

      <nav id="navbar" class="navbar order-last order-lg-0">
        <ul>
          <li><a class="nav-link scrollto active" ><Link to="/knjige">Knjige</Link></a></li>
          {user?.role==="Citaoc"&&
            <li><a class="nav-link scrollto" ><Link to="/iznajmljeneKnjige">Iznajmljene</Link></a></li>
          }
          {user?.role==='Admin' &&
            <li><a class="nav-link scrollto"><Link to="/pisci">Pisci</Link></a></li>
          }
          {user?.role==='Admin' &&
            <li><a class="nav-link scrollto"><Link to="/izdavaci">Izdavaci</Link></a></li>
          }
          {user?.role==='Admin' &&
            <li><a class="nav-link scrollto"><Link to="/zanri">Zanri</Link></a></li>
          }
          {user &&
            <li><a class="nav-link scrollto"><Link to="/profil">Profil</Link></a></li>
          }
        </ul>
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav>
      {!user &&
            <li><Link to="/login"><a className="get-started-btn scrollto" >LogIn</a></Link></li>
      }
      {user &&
        <li><Link to="/"><a className="get-started-btn scrollto" onClick={handleLogout}>LogOut</a></Link></li>
      }

    </div>
  </header>
  );
};

export default Header;
