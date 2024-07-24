import "./menu.css";
import logo from "../assets/logo.png";
import Password from "../popups/password";
import Navbar from "../navbar/navbar.jsx";
import SideBar from "../navbar/sidebar.jsx";
import MainContent from "../mainContent/mainContent.jsx";

function Menu() {
    return (
        <div id="menuContainer">
            <Password />
            <div className="menuTopContainer">
                <Navbar />
            </div>
            <div className="menuBottomContainer">
                <div className="leftBottomContainer">
                    <SideBar /> 
                </div>
                <div className="rightBottomContainer">
                    <MainContent />
                </div>
            </div>
        </div>
    );

    //                    
    //                    


}

export default Menu;
