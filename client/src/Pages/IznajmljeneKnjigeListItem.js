import Cookies from "js-cookie";
import axios from "axios";
import { Link } from "react-router-dom";
const IznajmljeneKnjigeListItem = ({
    item,
    key,
    setPisacID,
    vID,
    setObrisano,
    setStringGreska,
    setUpdatedKnjiga,
    updatedKnjiga,
    setShowAlert,
    obrisano
}) =>{
    const config = {
        headers: {Authorization: `Bearer ${Cookies.get("Token")}`}
      }
    const indeks=item.id;
    const handleDelete = () =>{
        axios
        .delete(`Izdavanje/DeleteIzdavanje/${indeks}`, config)
        .then((response) => {
            setObrisano(!obrisano);
            try{
                var flag=false;
                const response = axios.put(`/Knjiga/UpdateKnjigaIznajmljivanje/${item.knjigaId}/${flag}`,config);
                  if (response.status === 200) {
                    setUpdatedKnjiga(!updatedKnjiga)
                  } 
            }
            catch(err)
            {
                console.log(err);
            }
        })
        .catch((err) => {
            setStringGreska(`Error: + ${err.message}`);
        });
    }
    const backgroundImageStyle = {
        backgroundImage: 'url("' + item.knjiga.slika + '")',
        backgroundSize: 'contain', 
        backgroundPosition: 'center', 
        width: '100%', 
        height: '300px', 
    };
    return(
        <div className="pisac-card col-md-12 col-lg-3">
            <div className="banner-image" style={backgroundImageStyle}> </div>
            <h2> {item?.knjiga.naslov} </h2>
            <h2> Status: {item?.Status}</h2>
            <h2> Vreme uzimanja: {item.VremeIzdavanja.day}-{item.VremeIzdavanja.month}-{item.VremeIzdavanja.year}</h2>
            <button className="btn fill" onClick={handleDelete}>VratiKnjigu</button>
        </div>
    );
}
export default IznajmljeneKnjigeListItem;