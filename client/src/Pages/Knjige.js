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
import KnjigeListItem from "./KnjigeListItem";
const Knjige = () =>
{   const handleClose = () => setShowAlert(false);
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

    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
    }
    useEffect(()=>{
            setAdovano(false);
            setObrisano(false);
            axios.get('/Knjiga/GetKnjige',config)
            .then((response)=> {
                setCurrentItems(response.data);
            })
            .catch((err)=>{
                setStringGreska(`Error: + ${err.message}`);
            });
            axios.get('/Pisac/GetPisce',config)
            .then((response)=> {
                setWriters(response.data);
            })
            .catch((err)=>{
                setStringGreska(`Error: + ${err.message}`);
            });
            axios.get('/Izdavac/GetIzdavace',config)
            .then((response)=> {
                setPublishers(response.data);
            })
            .catch((err)=>{
                setStringGreska(`Error: + ${err.message}`);
            });
            axios.get('/Zanr/GetZanre',config)
            .then((response)=> {
                setGenres(response.data);
            })
            .catch((err)=>{
                setStringGreska(`Error: + ${err.message}`);
            })
        
    },[obrisano,addovano])
    const addKnjigu = async (e)=>
    {
        e.preventDefault();
        try{
            const validationErrors = {};
            if (name.length <= 0) {
              validationErrors.name = "Ime treba da ima više od 0 karaktera";
            }
            if (pages <= 0) {
              validationErrors.pages = "Broj strana treba da ima bude veća od 0";
            }
            if(writer==null)
            {
                validationErrors.pages = "Knjiga mora da ima pisca";
            }
            if(genre==null)
            {
                validationErrors.pages = "Knjiga mora da ima zanr";
            }
            if(publisher==null)
            {
                validationErrors.pages = "Knjiga mora da ima izdavača";
            }
            if (Object.keys(validationErrors).length > 0) {
              Object.keys(validationErrors).forEach((property) => {
                setStringGreska(
                  `Greška u polju ${property}: ${validationErrors[property]}`
                );
                setShowAlert(true);
              });
            }
            if (photo !== null) {
              const imageRef = ref(storage, `knjige/${photo.name + v4()}`);
              let photourl = "";
              uploadBytes(imageRef, photo).then(() => {
                getDownloadURL(imageRef).then(async (res) => {
                  photourl = res;
                  try {
                    const response = await axios.post("/Knjiga/AddKnjigu", {
                      naslov: name,
                      brojStrana: pages,
                      zanr: JSON.parse(genre),
                      izdavac: JSON.parse(publisher),
                      pisac:JSON.parse(writer),
                      brojnoStanje: available,
                      slika:photourl,
                    });
                    if (response.status === 200) {
                      setAdovano(true);
                    }
                    else {
                      setStringGreska("Greska pri dodavanju.");
                      setShowAlert(true);
                      console.log("Server returned status code " + response.status);
                    }
                  } catch (error) {
                      setStringGreska("Greska pri dodavanju.");
                      setShowAlert(true);
                      console.log("Error:", error);
                  }
                });
              });
            }
          }
          catch(err)
          {
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
            {user?.role==="Admin"&&
            <div className="pisac-card1 col-md-12 col-lg-3">
              <form onSubmit={addKnjigu}>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Naslov:</label> 
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
                  <label className="col-4 col-form-label" >BrojStrana:</label> 
                  <div className="col-8">
                    <input
                        value={pages}
                        onChange={(e) => setPages(e.target.value)}
                        type="number"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="form-control"
                        placeholder=" "
                        required
                      />
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >NaStanju:</label> 
                  <div className="col-8">
                  <input
                    value={available}
                    onChange={(e) => setAvailable(e.target.value)}
                    type="number"
                    name="date"
                    id="date"
                    className="form-control"
                    placeholder=" "
                    required
                  />
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label">Pisac:</label> 
                  <div className="col-8">
                  <select name="nationality" onChange={(e)=>setWriter(e.target.value)}>
                    <option value="">-- izaberi --</option>
                    {writers.map((item, ind) => (
                        <option value={JSON.stringify(item)} key={ind}>{item.ime} {item.prezime}</option>
                    ))}
                  </select>
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label">Zanr:</label> 
                  <div className="col-8">
                  <select name="nationality" onChange={(e)=>setGenre(e.target.value)}>
                    <option value="">-- izaberi --</option>
                    {genres.map((item, ind) => (
                        <option value={JSON.stringify(item)} key={ind}>{item.naziv}</option>
                    ))}
                  </select>
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label">Izdavač:</label> 
                  <div className="col-8">
                  <select name="nationality" onChange={(e)=>setPublisher(e.target.value)}>
                    <option value="">-- izaberi --</option>
                    {publishers.map((item, ind) => (
                        <option value={JSON.stringify(item)} key={ind}>{item.naziv}</option>
                    ))}
                  </select>
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label">Slika:</label> 
                  <div className="col-8">
                  <input
                    type="file"
                    name="slika"
                    onChange={(e) => setPhoto(e.target.files[0])}
                    id="slika"
                    className="block py-2.5 px-0 w-full text-sm"
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
            }
          {currentItems.map((item, ind) => (
            <KnjigeListItem
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
export default Knjige;