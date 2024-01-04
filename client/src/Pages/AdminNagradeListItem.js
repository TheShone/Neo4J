import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
const AdminNagradeListItem = ({   
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
        .delete(`Nagrada/DeleteNagrada/${indeks}`, config)
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
            <h4>DatumDodeljivanja: {item.datumDodeljivanja}</h4>
            <h4>MestoDodeljivanja: {item.mestoDodeljivanja}</h4>
            <button className="btn fill" onClick={handleDelete}>Obrisi</button>
        </div>
    );
}
export default AdminNagradeListItem;