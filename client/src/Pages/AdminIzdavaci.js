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
import AdminIzdavaciListItem from "./AdminIzdavaciListItem";
const AdminIzdavaci = () =>{
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
          axios.get('/Izdavac/GetIzdavace',config)
          .then((response)=> {
            setCurrentItems(response.data);
            console.log(response.data);
            setReadyy(true);
          })
          .catch((err)=>{
            setStringGreska(`Error: + ${err.message}`);
          })
        }
      })
    const addIzdavaca = async () =>{

    }
    return(
        <>
            <Modal
          show={showAlert}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Neuspešna Dodavanje Izdavaca</Modal.Title>
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
              <form onSubmit={addIzdavaca}>
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
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Prezime:</label> 
                  <div className="col-8">
                    <input
                        value={adress}
                        onChange={(e) => setAdress(e.target.value)}
                        type="text"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="form-control"
                        placeholder=" "
                        required
                      />
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Prezime:</label> 
                  <div className="col-8">
                    <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        type="text"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="form-control"
                        placeholder=" "
                        required
                      />
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Prezime:</label> 
                  <div className="col-8">
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
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
            <AdminIzdavaciListItem
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
    );
}
export default AdminIzdavaci;