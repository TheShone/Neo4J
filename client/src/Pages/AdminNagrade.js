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
import AdminNagradeListItem from "./AdminNagradeListItem";
const AdminNagrade = () => {
    const handleClose = () => setShowAlert(false);
    const {user,ready} = useContext(UserContext);
    const [showAlert, setShowAlert] = useState(false);
    const [stringGreska, setStringGreska] = useState("");
    const [currentItems,setCurrentItems] = useState([]);
    const [readyy,setReadyy] = useState(false);
    const [obrisano,setObrisano]=useState(false);
    const [name,setName]=useState("");
    const [date,setDate]=useState("");
    const [place,setPlace]=useState("");
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
    }
    useEffect(()=>{
        if(user){
          axios.get('/Nagrade/GetNagrade',config)
          .then((response)=> {
            setCurrentItems(response.data);
            setReadyy(true);
          })
          .catch((err)=>{
            setStringGreska(`Error: + ${err.message}`);
          })
        }
      })
      const addNagradu = async (e) =>{
        e.preventDefault();
    try{
        const validationErrors = {};
        if (name.length <= 0) {
            validationErrors.name = "Naziv treba da ima više od 0 karaktera";
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
                const response = await axios.post("/Nagrada/AddNagrada", {
                    naziv: name,
                    datumDodeljivanja: date,
                    mestoDodeljivanja: place,
                });
                if (response.status !== 200) {
                    console.log("Server returned status code " + response.status);
                    console.log(response.data);
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
            <div className="nagrada-card col-md-12 col-lg-3">
              <form onSubmit={addNagradu}>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Naziv:</label> 
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
                  <label className="col-4 col-form-label" >Datum:</label> 
                  <div className="col-8">
                    <input
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        type="date"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="form-control"
                        placeholder=" "
                        required
                      />
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Mesto:</label> 
                  <div className="col-8">
                    <input
                        value={place}
                        onChange={(e) => setPlace(e.target.value)}
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
            <AdminNagradeListItem
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
export default AdminNagrade;