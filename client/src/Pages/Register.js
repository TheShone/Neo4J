import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { storage } from "./Firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { Modal } from "react-bootstrap";
import { Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [surName, setSurName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [number, setNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [stringGreska, setStringGreska] = useState("");
  const navigate = useNavigate();

  async function register(e) {
    e.preventDefault();
    try {
      const validationErrors = {};
      if (name.length <= 0) {
        validationErrors.name = "Ime treba da ima više od 0 karaktera";
      }
      if (surName.length <= 0) {
        validationErrors.surName = "Prezime treba da ima više od 0 karaktera";
      }
      if (userName.length <= 0) {
        validationErrors.userName =
          "Korisnicko ime treba da ima više od 0 karaktera";
      }
      if (
        email.length <= 0 ||
        !/^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/.test(email)
      ) {
        validationErrors.email =
          "Email treba da ima više od 0 karaktera i da bude u formatu emaila";
      }
      if (password.length <= 7) {
        validationErrors.Naziv = "Sifra mora da ima vise od 7 karaktera";
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
        const imageRef = ref(storage, `citaoci/${photo.name + v4()}`);
        let photourl = "";
        uploadBytes(imageRef, photo).then(() => {
          getDownloadURL(imageRef).then(async (res) => {
            photourl = res;
            try {
              const response = await axios.post("/Citalac/AddCitaoca", {
                ime: name,
                prezime: surName,
                korisnickoIme: userName,
                email: email,
                sifra: password,
                brojTelefona: number,
                datumRodjenja: birthDate,
                slika: photourl,
              });
              if (response.status === 200) {
                navigate("/");
              } else {
                console.log("Server returned status code " + response.status);
                console.log(response.data);
              }
            } catch (error) {
              if (error.response && error.response.status === 400) {
                const errorMessage = error.response.data;
                setStringGreska("Već postoji nalog sa tim emailom ili korisnickim imenom.");
                setShowAlert(true);
                console.log(error.response);
              } else {
                console.log("Error:", error.message);
              }
            }
          });
        });
      }
    }
      catch (err) {
      console.log("Error:", err.message);
    }
  }
  const handleClose = () => setShowAlert(false);

  return (
    <>
    <Modal
  show={showAlert}
  onHide={handleClose}
  backdrop="static"
  keyboard={false}
>
  <Modal.Header closeButton>
    <Modal.Title>Neuspešna Registracija</Modal.Title>
  </Modal.Header>
  <Modal.Body>{stringGreska}</Modal.Body>
  <Modal.Footer>
    <button className="btn-prim" onClick={handleClose}>
      Zatvori
    </button>
  </Modal.Footer>
</Modal>
    <div style={{ marginTop: "130px" }}>
      <form className="max-w-md mx-auto" onSubmit={register}> 
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
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Ime
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={surName}
              onChange={(e) => setSurName(e.target.value)}
              type="text"
              name="floating_last_name"
              id="floating_last_name"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Przime
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              type="text"
              name="floating_username"
              id="floating_username"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Korisničko ime
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="floating_email"
              id="floating_email"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email adresa
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-2 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              name="floating_password"
              id="floating_password"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Password
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              type="text"
              name="floating_phone"
              id="floating_phone"
              className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Broj telefona
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-3 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <label for="date" className="mt-2 text-gray-500">
              DatumRodjenja:
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              type="date"
              name="date"
              id="date"
              className="block py-2.5 px-0 w-full text-sm"
              placeholder=" "
              required
            />
          </div>
        </div>
        <div className="grid md:grid-cols-3 md:gap-6">
          <div className="relative z-0 w-full mb-5 group">
            <label  className="mt-2 text-gray-500">
              Slika:
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
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
        <button
          type="submit"
          className="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400"
        >
          Sačuvaj
        </button>
        <h5>
                Imate nalog?{" "}
                <Link to={"/login"}>Prijate se</Link>
        </h5>
      </form>
    </div>
    </>
  );
};
export default Register;
