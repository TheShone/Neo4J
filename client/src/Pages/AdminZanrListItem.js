import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
const AdminZanrListItem = (
    {
        item,
        key,
        vID,
        setObrisano,
        setStringGreska
    }
) =>{
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
      }
    const indeks=item.id;
    const handleDelete = () =>{
        axios
        .delete(`Zanr/DeleteZanr/${indeks}`, config)
        .then((response) => {
            setObrisano(true);
        })
        .catch((err) => {
            console.log(indeks);
            console.log(err.message);
            setStringGreska(`Error: + ${err.message}`);
        });
    }
    return(
        <div className="pisac-card col-md-12 col-lg-3">
            <h4>Naziv: {item.naziv}</h4>
            <button className="btn fill" onClick={handleDelete}>Obrisi</button>
        </div>
    )
}
export default AdminZanrListItem;