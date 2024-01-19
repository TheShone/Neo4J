import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import React, { useContext, useEffect, useState } from "react";
const AdminIzdavaciListItem = ({
  item,
  key,
  vID,
  setObrisano,
  setStringGreska,
}) => {
  const config = {
    headers: { Authorization: `Bearer ${Cookies.get("Token")}` },
  };
  const indeks = item.id;
  const { user, ready } = useContext(UserContext);
  const handleDelete = () => {
    axios
      .delete(`Izdavac/DeleteIzdavac/${indeks}`, config)
      .then((response) => {
        setObrisano(true);
      })
      .catch((err) => {
        console.log(indeks);
        console.log(err.message);
        setStringGreska(`Error: + ${err.message}`);
      });
  };
  return user?.role === "Admin" ? (
    <div className="pisac-card col-md-12 col-lg-3">
      <h4>Naziv: {item.naziv}</h4>
      <h4>Adresa: {item.adresa}</h4>
      <h4>Telefon: {item.kontaktTelefon}</h4>
      <h4>Email: {item.email}</h4>
      <button className="btn fill" onClick={handleDelete}>
        Obrisi
      </button>
    </div>
  ) : (
    <Navigate to={"/"} />
  );
};
export default AdminIzdavaciListItem;
