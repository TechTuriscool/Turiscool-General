import "./menu.css";
import logo from "../assets/logo.png";
import Password from "../popups/password";

function Menu() {
    return (
        <div id="principalContainer">
            <Password />
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="secundaryContainer">
                <a href="/average"><button className="menu-button">Ver Medias</button></a>
                <a href="/firmafy"><button className="menu-button">Firmafy</button></a>
                <button className="menu-button">...</button>
                <button className="menu-button">...</button>
            </div>
        </div>
    );
}

export default Menu;
