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
import IznajmljeneKnjigeListItem from "./IznajmljeneKnjigeListItem";
const IznajmljeneKnjige = () =>{
    const handleClose = () => setShowAlert(false);
    const [name,setName] = useState("");
    const [pages,setPages]=useState("");
    const [available,setAvailable]=useState("")
    const [showAlert, setShowAlert] = useState(false);
    const [stringGreska, setStringGreska] = useState("");
    const [writer,setWriter]=useState(null);
    const [publisher,setPublisher]=useState(null);
    const [genre,setGenre]=useState(null);
    const {user,ready} = useContext(UserContext);
    const [currentItems,setCurrentItems] = useState([]);
    const [writers,setWriters]=useState([]);
    const [genres,setGenres]=useState([]);
    const [publishers,setPublishers]=useState([]);
    const [readyy,setReadyy] = useState(false);
    const [obrisano,setObrisano]=useState(false);
    const [photo,setPhoto]=useState("");
    const [addovano,setAdovano]=useState(false);
    const [updatedKnjiga,setUpdatedKnjiga]=useState(false);
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
    }
    useEffect(()=>{
        if(user)
        {
            axios.get(`/Izdavanje/GetIznajmljenihKnjigaZaCitaoca/${user.id}`,config)
            .then((response)=> {
                setCurrentItems(response.data);
                console.log(response.data);
            })
            .catch((err)=>{
                setStringGreska(`Error: + ${err.message}`);
            });
        }
    },[obrisano]);
    return (
        <>
            <Modal
          show={showAlert}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>Greska</Modal.Title>
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
                {currentItems.map((item, ind) => (
                    <IznajmljeneKnjigeListItem
                    item={item}
                    key={ind}
                    vID={user.id}
                    setObrisano={setObrisano}
                    setStringGreska={setStringGreska}
                    setUpdatedKnjiga={setUpdatedKnjiga}
                    updatedKnjiga={updatedKnjiga}
                    setShowAlert={setShowAlert}
                    obrisano={obrisano}
                    />
                ))}
                </div>
            </div>
        </div>
        </>
    );
}
export default IznajmljeneKnjige;