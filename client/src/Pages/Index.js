import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Index = () =>{
    return(
        <section id="hero" class="d-flex align-items-center justify-content-center">
            <div class="container">
            <div class="row justify-content-center">
                <div class="col-xl-6 col-lg-8">
                <h1>Biblioteka Intalica</h1>
                </div>
            </div>

            <div class="row gy-4 mt-5 justify-content-center">
                <div class="col-xl-2 col-md-4">
                <div class="icon-box">
                    <h3><a>Pregled</a></h3>
                </div>
                </div>
                <div class="col-xl-2 col-md-4">
                <div class="icon-box">
                    <h3><a>Iznajmljivanje</a></h3>
                </div>
                </div>
                <div class="col-xl-2 col-md-4">
                <div class="icon-box">
                    <h3><a>Ocenjivanje</a></h3>
                </div>
                </div>
            </div>
            </div>
            </section>
    );
}
export default Index;