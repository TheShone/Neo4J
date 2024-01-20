import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "./Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import Cookies from "js-cookie";
import AdminZanrListItem from "./AdminZanrListItem";
import { Navigate } from "react-router-dom";

const AdminZanr = () =>{
    const handleClose = () => setShowAlert(false);
    const {user,ready} = useContext(UserContext);
    const [name,setName] = useState("");
    const [adress,setAdress] = useState("");
    const [phone,setPhone]=useState("");
    const [email,setEmail]=useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [stringGreska, setStringGreska] = useState("");
    const [currentItems,setCurrentItems] = useState([]);
    const [readyy,setReadyy] = useState(false);
    const [obrisano,setObrisano]=useState(false);
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
      }
      useEffect(()=>{
        if(user){
          axios.get('/Zanr/GetZanre',config)
          .then((response)=> {
            setCurrentItems(response.data);
            setReadyy(true);
          })
          .catch((err)=>{
            setStringGreska(`Error: + ${err.message}`);
          })
        }
      })
    const addZanr = async (e) =>{
        e.preventDefault();
    try{
      const validationErrors = {};
      if (name.length <= 0) {
        validationErrors.name = "Ime treba da ima više od 0 karaktera";
      }
      if (Object.keys(validationErrors).length > 0) {
        Object.keys(validationErrors).forEach((property) => {
          setStringGreska(
            `Greška u polju ${property}: ${validationErrors[property]}`
          );
          setShowAlert(true);
        });
      }
        try {
            const response = await axios.post("/Zanr/AddZanr", {
            naziv: name,
            });
            if (response.status !== 200) {
            console.log("Server returned status code " + response.status);
            }
        } catch (error) {
            setStringGreska("Greska pri dodavanju.");
            setShowAlert(true);
            console.log("Error:", error.message);
        }
    }
    catch(err)
    {
      setStringGreska("Greska pri dodavanju.");
      setShowAlert(true);
      console.log("Error: "+err.message)
    }
    }
    return(
      user?.role==='Admin' ? (
        <>
            <Modal
          show={showAlert}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Greška</Modal.Title>
          </Modal.Header>
          <Modal.Body>{stringGreska}</Modal.Body>
          <Modal.Footer>
            <button className="btn-prim" onClick={handleClose}>
              Zatvori
            </button>
          </Modal.Footer>
        </Modal>
        <div style={{ marginTop: "130px"}}>
      <div id="glavni">
        <div className="pisci-container">
            <div className="pisac-card1 col-md-12 col-lg-3">
              <form onSubmit={addZanr}>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Ime:</label> 
                  <div className="col-8">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="form-control"
                        placeholder=" "
                        required
                      />
                  </div>
                </div>
                <div className="form-group row">
                  <div className="offset-4 col-8">
                    <button name="submit" type="submit" className="btn btn-primary">Dodaj</button>
                  </div>
                </div>
              </form>
          </div>
          {currentItems.map((item, ind) => (
            <AdminZanrListItem
              item={item}
              key={ind}
              vID={user.id}
              setObrisano={setObrisano}
              setStringGreska={setStringGreska}
            />
           ))}
      </div>
    </div>
    </div>
    </>
    ) : (
      <Navigate to={"/"}/>
    )
    );
}
export default AdminZanr;