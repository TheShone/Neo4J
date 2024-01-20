import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../UserContext";

const KnjigeListItem = ({
    item,
    key,
    setPisacID,
    vID,
    setObrisano,
    setStringGreska
}) =>{
    const {user,ready} = useContext(UserContext);
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
      }
    const indeks=item.id;
    const handleDelete = () =>{
        axios
        .delete(`Knjiga/DeleteKnjigu/${indeks}`, config)
        .then((response) => {
            setObrisano(true);
        })
        .catch((err) => {
            setStringGreska(`Error: + ${err.message}`);
        });
    }
    const backgroundImageStyle = {
        backgroundImage: 'url("' + item.slika + '")',
        backgroundSize: 'contain', 
        backgroundPosition: 'center', 
        width: '100%', 
        height: '300px', 
    };
    return(
        <div className="pisac-card col-md-12 col-lg-3">
            <div className="banner-image" style={backgroundImageStyle}> </div>
            <h3> {item.naslov} </h3>
            <h3> {item.pisac.ime} {item.pisac.prezime}</h3>
            <Link to={`/knjiga/${item.id}`}><button className="btn fill">Detalji</button></Link>
            {user?.role==="Admin"&& <button className="btn fill" onClick={handleDelete}>Obrisi</button>}
        </div>
    );
}
export default KnjigeListItem;