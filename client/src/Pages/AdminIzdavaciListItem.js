import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
const AdminIzdavaciListItem = ({
    item,
    key,
    vID,
    setObrisano,
    setStringGreska
}) =>
{
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
      }
    const indeks=item.id;
    const handleDelete = () =>{
        axios
        .delete(`Izdavac/DeleteIzdavac/${indeks}`, config)
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
            <h1> {item.naziv}</h1>
            <h1> {item.adresa}</h1>
            <h1> {item.kontaktTelefon}</h1>
            <h1> {item.email}</h1>
            <button className="btn fill" onClick={handleDelete}>Obrisi</button>
        </div>
    )
}
export default AdminIzdavaciListItem;