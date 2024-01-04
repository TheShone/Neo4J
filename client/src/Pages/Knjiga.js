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
    const [publisher,setPublisher]=useState("");
    const [item,setItem]=useState("");
    const [photo,setPhoto]=useState("");
    const [pages,setPages]=useState("");
    const [available,setAvailable]=useState("");
    const [updatedKnjiga,setUpdatedKnjiga]=useState(false);
    const handleClose = () => setShowAlert(false);
    const { id } = useParams();
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
                console.log(response.data);
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
        }
    },[updatedKnjiga]);
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
        </div>
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
      </form>
    </div>
    </>
    );
}
export default Knjiga;