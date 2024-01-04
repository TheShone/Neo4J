import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
const KnjigeListItem = ({
    item,
    key,
    setPisacID,
    vID,
    setObrisano,
    setStringGreska
}) =>{
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
      }
    const indeks=item.id;
    const handleDelete = () =>{
        axios
        .delete(`Knjiga/DeleteKnjiga/${indeks}`, config)
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
        backgroundImage: 'url("' + item.slika + '")',
        backgroundSize: 'contain', 
        backgroundPosition: 'center', 
        width: '100%', 
        height: '300px', 
    };
    return(
        <div className="pisac-card col-md-12 col-lg-3">
            <div className="banner-image" style={backgroundImageStyle}> </div>
            <h3> {item.naslov} </h3>
            <h3> {item.pisac.ime} {item.pisac.prezime}</h3>
            <Link to={`/knjiga/${item.id}`}><button className="btn fill">Detalji</button></Link>
            <button className="btn fill" onClick={handleDelete}>Obrisi</button>
        </div>
    );
}
export default KnjigeListItem;