import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = () =>{
    return(
        <div className="flex-col justify justify-between font-familija pt-26">
            <Header/>
            <div className="min-h-screen">
                <Outlet />
            </div>
           
            <Footer /> 
        </div>
    )
}
export default Layout;