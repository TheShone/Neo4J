import { Link } from "react-router-dom";
const Header = () => {
  return (
    <header id="header" class="fixed-top ">
    <div class="container d-flex align-items-center justify-content-lg-between my-1">

      <h1 class="logo me-auto me-lg-0"><a>Biblioteka</a><span>.</span></h1>
      <a href="index.html" class="logo me-auto me-lg-0"><img src="assets/img/logo.png" alt="" class="img-fluid"/></a>

      <nav id="navbar" class="navbar order-last order-lg-0">
        <ul>
          <li><a class="nav-link scrollto active" ><Link to="/knjige">Knjige</Link></a></li>
          <li><a class="nav-link scrollto" >Iznajmljene</a></li>
          <li><a class="nav-link scrollto" ><Link to="/registration">Register</Link></a></li>
          <li><a class="nav-link scrollto " >Portfolio</a></li>
          <li><a class="nav-link scrollto" >Team</a></li>
          <li class="dropdown"><a href="#"><span>Drop Down</span> <i class="bi bi-chevron-down"></i></a>
            <ul>
              <li><a href="#">Drop Down 1</a></li>
              <li class="dropdown"><a href="#"><span>Deep Drop Down</span> <i class="bi bi-chevron-right"></i></a>
                <ul>
                  <li><a href="#">Deep Drop Down 1</a></li>
                  <li><a href="#">Deep Drop Down 2</a></li>
                  <li><a href="#">Deep Drop Down 3</a></li>
                  <li><a href="#">Deep Drop Down 4</a></li>
                  <li><a href="#">Deep Drop Down 5</a></li>
                </ul>
              </li>
              <li><a href="#">Drop Down 2</a></li>
              <li><a href="#">Drop Down 3</a></li>
              <li><a href="#">Drop Down 4</a></li>
            </ul>
          </li>
          <li><a class="nav-link scrollto" href="#contact">Contact</a></li>
        </ul>
        <i class="bi bi-list mobile-nav-toggle"></i>
      </nav>

      <a href="#about" class="get-started-btn scrollto">Get Started</a>

    </div>
  </header>
  );
};

export default Header;
