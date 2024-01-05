import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { Modal } from "react-bootstrap";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [redirect, setRedirect] = useState(false);
  const { user, setUser } = useContext(UserContext);
  const [showNeuspesno, setShowNeuspesno] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  async function loginUser(e) {
    e.preventDefault();
    try {
      const encodedEmail = encodeURIComponent(email);
      const encodedPass = encodeURIComponent(pass);
      const userInfo = await axios.post(
        `/Login/Login/${encodedEmail}/${encodedPass}`
      );
      setUser(userInfo.data);
      setRedirect(true);
    } catch (e) {
      setShowNeuspesno(true);
    }
  }
  if (redirect) {
    return <Navigate to={"/knjige"} />;
  }
  const handleClose = () => setShowNeuspesno(false);

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Modal
        show={showNeuspesno}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Neuspešno Prijavljivanje</Modal.Title>
        </Modal.Header>
        <Modal.Body>Pogrešan email ili lozinka, pokušajte ponovo.</Modal.Body>
        <Modal.Footer>
          <button className="btn-prim" onClick={handleClose}>
            Zatvori
          </button>
        </Modal.Footer>
      </Modal>
      <div style={{ marginTop: "150px" }}>
        <div className="mt-4 text-bold grow flex items-center justify-around">
          <div className="my-20">
            <h1 className="text-2xl text-center mb-4">Prijavljivanje:</h1>
            <form
              className="max-w-lg mx-auto w-4/5"
              onSubmit={loginUser}
              autoComplete="off"
            >
              <div class="relative z-0 w-full mb-5 group">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              name="floating_email"
              id="floating_email"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="floating_email"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email adresa
            </label>
          </div>
          <div class="relative z-0 w-full mb-5 group">
            <input
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              type="password"
              name="floating_email"
              id="floating_email"
              class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              for="floating_email"
              class="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Šifra
            </label>
          </div>
              <button className="text-white bg-yellow-300 hover:bg-yellow-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-yellow-300 dark:hover:bg-yellow-400 dark:focus:bg-yellow-400">Prijavi se</button>
              <div className="text-center py-2">
                <h5>
                  Nemate nalog?{" "}
                  <Link to={"/registration"}>Kreirajte nalog</Link>
                </h5>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
