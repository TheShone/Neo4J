import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import Cookies from "js-cookie";
import axios from "axios";
import { v4 } from "uuid";
import { Link } from "react-router-dom";
import { UserContext } from "../UserContext";
import { storage } from "./Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { Modal } from "react-bootstrap";
const Knjiga = () =>
{
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
    }
    const [updateFlag,setUpdateFlag]=useState(false);
    const [stringGreska, setStringGreska] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [updatedPisac,setUpdatedPisac] = useState(false);
    const [name,setName]=useState("");
    const [writerName,setWriterName]=useState("");
    const [writerSurName,setWriterSurName]=useState("");
    const [genre,setGenre]=useState("");
    const {user,ready} = useContext(UserContext);
    const [publisher,setPublisher]=useState("");
    const [item,setItem]=useState("");
    const [photo,setPhoto]=useState("");
    const [reader,setReader]=useState("");
    const [pages,setPages]=useState("");
    const [available,setAvailable]=useState("");
    const [updatedKnjiga,setUpdatedKnjiga]=useState(false);
    const [mark,setMark]=useState("");
    const [addovanComm,setAddovanComm]=useState(false);
    const [comm,setComm]=useState("");
    const [reviews,setReviews]=useState([]);
    const [deleted,setDeleted]=useState(false);
    
    const handleClose = () => setShowAlert(false);
    const { id } = useParams();
    const iznajmiKnjigu = async (e) =>{
      e.preventDefault();
      try{
        const currentDate = new Date();
        const response = await axios.post(`/Izdavanje/AddIzdavanje/${user.id}/${item.id}`,
        {
            vremeIzdavanja:currentDate.toISOString().split('T')[0],
            status:"Aktivno"
        });
          if (response.status === 200) {
            try{
              var flag=true;
              const response = await axios.put(`/Knjiga/UpdateKnjigaIznajmljivanje/${id}/${flag}`,config);
                if (response.status === 200) {
                  setUpdatedKnjiga(!updatedKnjiga)
                } else {
                  setStringGreska("Greska pri izmeni.");
                  setShowAlert(true);
                  console.log("Server returned status code " + response.status);
                }
          }
          catch(err)
          {
              console.log(err);
          }
          } else {
            setStringGreska("Greska");
            setShowAlert(true);
            console.log("Server returned status code " + response.status);
          }
      }
      catch(err)
      {
         console.log(err);
      }
    }
    const handleKomentar = async (e)=>{
      e.preventDefault();
      try{
        const response = await axios.post(`/Recenzija/AddRecenzija/${user.id}/${item.id}`,
        {
            ocena:mark,
            komentar:comm 
        });
          if (response.status === 200) {
            setAddovanComm(!addovanComm);
          } else {
            setStringGreska("Greska pri dodavanju recenzije.");
            setShowAlert(true);
            console.log("Server returned status code " + response.status);
          }
      }
      catch(err)
      {
         console.log(err);
      }
    }
    const izmeni =(e)=>{
        e.preventDefault();
        setUpdateFlag(!updateFlag)
       }
      const backgroundImageStyle = {
          backgroundImage: 'url("' + photo + '")',
          backgroundSize: 'contain', 
          backgroundPosition: 'center', 
          width: '200px', 
          height: '200px',
          marginBottom: '20px',
          marginLeft:'50px'
      };
      const handleDelete = async (idRecenzije) =>{
          try{
            const response = await axios.delete(`/Recenzija/DeleteRecenziju/${idRecenzije}`,config);
              if (response.status === 200) {
                setDeleted(!deleted);
              } else {
                setStringGreska("Greska pri brisanju.");
                setShowAlert(true);
                console.log("Server returned status code " + response.status);
              }
        }
        catch(err)
        {
            console.log(err);
        }
      }
      const updateStanje = async () =>{
        try{
            const response = await axios.put(`/Knjiga/UpdateKnjigaStanje/${id}/${available}`,config);
              if (response.status === 200) {
                setUpdateFlag(false);
                setUpdatedKnjiga(!updatedKnjiga)
              } else {
                setStringGreska("Greska pri izmeni.");
                setShowAlert(true);
                console.log("Server returned status code " + response.status);
              }
        }
        catch(err)
        {
            console.log(err);
        }
      }
      useEffect(()=>{
        if(id)
        {
            axios.get(`/Knjiga/GetKnjigu/${id}`)
            .then((response)=>{
                setItem(response.data);
                setName(response.data.naslov);
                setWriterName(response.data.pisac.Ime);
                setWriterSurName(response.data.pisac.Prezime);
                setGenre(response.data.zanr.Naziv);
                setPublisher(response.data.izdavac.Naziv);
                setPages(response.data.brojStrana);
                setAvailable(response.data.brojnoStanje)
                setPhoto(response.data.slika);
            })
            .catch((err)=>{
                console.log(err);
            })
            axios.get(`/Recenzija/GetRecenzijeZaKnjigu/${id}`)
            .then((response)=>{
              setReviews(response.data);
            })
            .catch((err)=>{
              console.log(err);
            })
        }
    },[updatedKnjiga,addovanComm,deleted]);
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
      <div style={{ marginTop: "130px" }}>
      <form className="max-w-md mx-auto" >
      <div className="banner-image" style={backgroundImageStyle}> </div> 
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={true}
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Naslov
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={publisher}
              onChange={(e) => setPublisher(e.target.value)}
              type="text"
              name="floating_last_name"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={true}
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Izdavač
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={writerName}
              onChange={(e) => setWriterName(e.target.value)}
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={true}
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Ime pisca
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={writerSurName}
              onChange={(e) => setWriterSurName(e.target.value)}
              type="text"
              name="floating_last_name"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={true}
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Prezime pisca
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              type="text"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={true}
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Žanr
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={pages}
              onChange={(e) => setPages(e.target.value)}
              type="number"
              name="floating_first_name"
              id="floating_first_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={true}
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Broj strana
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
        <div className="relative z-0 w-full mb-5 group">
            <input
              value={available}
              onChange={(e) => setAvailable(e.target.value)}
              type="number"
              name="floating_last_name"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              disabled={!updateFlag}
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Broj primeraka
            </label>
          </div>
          {user?.role==="Citaoc" && available>0 &&
            <div className="relative z-0 w-full mb-5 group">
            <button
              type="submit"
              onClick={iznajmiKnjigu}
              className="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400"
            >Iznajmi</button>
          </div>
          }
        </div>
        {user?.role!="Admin" && 
          <div className="relative z-0 w-full mb-5 group">
          
          <h3
            className=" text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Recenzije:
          </h3>
        </div>
        }
        {user?.role ==="Admin" &&
        <>
        <button
          type="submit"
          className="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400"
          onClick={izmeni}
        >
          PromeniStanje
        </button>
        <button
          disabled={!updateFlag}
          type="submit"
          onClick={updateStanje}
          className="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400"
        >
          Sacuvaj
        </button>
        </>
        }
        {user?.role === "Citaoc" &&
          <div className="pisac-card">
            <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Ocena:</label> 
                  <div className="col-8">
                    <input
                        value={mark}
                        onChange={(e) => setMark(e.target.value)}
                        type="number"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="form-control"
                        placeholder=" "
                        min="1"
                        max="5"
                      />
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Komentar:</label> 
                  <div className="col-8">
                    <input
                        value={comm}
                        onChange={(e) => setComm(e.target.value)}
                        type="text"
                        name="floating_first_name"
                        id="floating_first_name"
                        className="form-control"
                        placeholder=" "
                        
                      />
                  </div>
                </div>
                <button className="btn fill" style={{ marginLeft: "280px" }} onClick={handleKomentar}>Dodaj</button>
          </div>
        }
        {reviews.map((item,ind)=>(
            <div className="review-card">
              <div className="form-group row padding">
                    <label className="col-4 col-form-label" >Ocena:</label> 
                    <div className="col-8">
                      <label className="col-4 col-form-label">{item.Ocena}</label>
                    </div>
              </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Komentar:</label> 
                  <div className="col-8">
                    <label className="col-4 col-form-label">{item.Komentar}</label>
                  </div>
                </div>
                <div className="form-group row padding">
                  <label className="col-4 col-form-label" >Čitaoc:</label> 
                  <div className="col-8">
                    <label className="col-4 col-form-label">{item.citalac.KorisnickoIme}</label>
                  </div>
                </div>
                {item.citalac.KorisnickoIme===user.korisnickoIme&&
                  <button className="btn fill" style={{ marginLeft: "280px" }} onClick={()=>handleDelete(item.id)}>Obrisi</button>
                }
          </div>

        ))

        }
      </form>
    </div>
    </>
    );
}
export default Knjiga;