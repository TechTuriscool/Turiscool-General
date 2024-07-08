import "./menu.css";
import logo from "../assets/logo.png";
function Menu() {
    return (
        <div id="principalContainer">
            <div className="logo">
                <img src={logo} alt="logo" />
            </div>
            <div className="secundaryContainer">
                <a href="/average"><button className="menu-button">Ver Medias</button></a>
                <button className="menu-button">...</button>
                <button className="menu-button">...</button>
                <button className="menu-button">...</button>
            </div>
        </div>
    );
}

export default Menu;
