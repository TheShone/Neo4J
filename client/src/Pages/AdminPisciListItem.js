import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

const AdminPisciListItem = ({
    item,
    key,
    setPisacID,
    vID,
    lastUpdate,
    setLastUpdate,
    setObrisano,
    setStringGreska
}) =>
{
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
      }
    const indeks=item.id;
    const {user,ready} = useContext(UserContext);
    const handleDelete = () =>{
        axios
        .delete(`Pisac/DeletePisac/${indeks}`, config)
        .then((response) => {
            setObrisano(true);
        })
        .catch((err) => {
            setStringGreska(`Error: + ${err.message}`);
        });
    }
    const backgroundImageStyle = {
        backgroundImage: 'url("' + item.fotografija + '")',
        backgroundSize: 'contain', 
        backgroundPosition: 'center', 
        width: '100%', 
        height: '300px', 
    };
    return(
        user?.role==='Admin' ? (
        <div className="pisac-card col-md-12 col-lg-3">
            <div className="banner-image" style={backgroundImageStyle}> </div>
            <h1> {item.ime} {item.prezime}</h1>
            <Link to={`/pisac/${item.id}`}><button className="btn fill">Detalji</button></Link>
            <button className="btn fill" onClick={handleDelete}>Obrisi</button>
        </div>
        ) : (
            <Navigate to={"/"}/>
          )
    )
}
export default AdminPisciListItem;