import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
const AdminPisciListItem = ({
    item,
    key,
    setPisacID,
    vID,
    lastUpdate,
    setLastUpdate,
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
        .delete(`Pisac/DeletePisac/${indeks}`, config)
        .then((response) => {
            setObrisano(true);
        })
        .catch((err) => {
            console.log(indeks);
            console.log(err.message);
            setStringGreska(`Error: + ${err.message}`);
        });
    }
    const backgroundImageStyle = {
        backgroundImage: 'url("' + item.fotografija + '")',
        backgroundSize: 'contain', 
        backgroundPosition: 'center', 
        width: '100%', 
        height: '300px', 
    };
    return(
        <div className="pisac-card col-md-12 col-lg-3">
            <div className="banner-image" style={backgroundImageStyle}> </div>
            <h1> {item.ime} {item.prezime}</h1>
            <Link to={`/pisac/${item.id}`}><button className="btn fill">Detalji</button></Link>
            <button className="btn fill" onClick={handleDelete}>Obrisi</button>
        </div>
    )
}
export default AdminPisciListItem;