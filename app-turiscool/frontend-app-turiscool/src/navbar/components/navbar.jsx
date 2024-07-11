import React from "react";
import { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.png";
import "./navbar.css";
import flechaAbajo from "../../assets/flecha abajo.svg";
import flechaDerecha from "../../assets/flecha derecha.svg";
import lupa from "../../assets/lupa.svg";
import salir from "../../assets/salir.svg";

const Navbar = () => {
    const [dropdown1Open, setDropdown1Open] = useState(false);
    const [dropdown2Open, setDropdown2Open] = useState(false);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);

    // Cerrar el menú desplegable si se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef1.current && 
                !dropdownRef1.current.contains(event.target) &&
                dropdown1Open
            ) {
                setDropdown1Open(false);
            }
            if (
                dropdownRef2.current && 
                !dropdownRef2.current.contains(event.target) &&
                dropdown2Open
            ) {
                setDropdown2Open(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdown1Open, dropdown2Open]);

    // Si la url coincide con la ruta actual, se le añade la clase "active" al elemento
    useEffect(() => {
        const currentLocation = window.location.pathname;
        const menuItems = document.querySelectorAll('.menuNavbar ul li');

        // Recorrer todos los elementos del submenu y si la ruta coincide con la actual, añadir la clase "active" tanto al elemento padre como al hijo
        menuItems.forEach(item => {
            const submenu = item.querySelector('.submenu');
            if (submenu) {
                const submenuItems = submenu.querySelectorAll('li');
                submenuItems.forEach(subitem => {
                    const subitemHref = subitem.querySelector('a').getAttribute('href');
                    if (subitemHref === currentLocation) {
                        item.classList.add('active');
                        subitem.classList.add('active');
                    }
                });
            }
        });

        // Recorrer los elementos del menú y añadir la clase "active" al elemento que coincida con la ruta actual
        menuItems.forEach(item => {
            const itemHref = item.querySelector('a').getAttribute('href');
            if (itemHref === currentLocation) {
                item.classList.add('active');
            }
        });
    }, []);

    const toggleDropdown1 = () => {
        setDropdown1Open(!dropdown1Open);
    };

    const toggleDropdown2 = () => {
        setDropdown2Open(!dropdown2Open);
    };

    return (
        <nav>
            <div className="navbar">
                <img className="imgNavbar" src={logo} alt="Logo" />

                <div className="menuNavbar">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li className="dropdown" ref={dropdownRef1}>
                            <a onClick={toggleDropdown1}>Educación</a>
                            {dropdown1Open ? (
                                <img src={flechaAbajo} alt="Flecha Abajo" />
                            ) : (
                                <img src={flechaDerecha} alt="Flecha Derecha" />
                            )}
                            {dropdown1Open && (
                                <ul className="submenu">
                                    <li><a href="/average">Medias</a></li>
                                    <li><a href="#">...</a></li>
                                    <li><a href="#">...</a></li>
                                </ul>
                            )}
                        </li>
                        <li className="dropdown" ref={dropdownRef2}>
                            <a onClick={toggleDropdown2}>Customer Success</a>
                            {dropdown2Open ? (
                                <img src={flechaAbajo} alt="Flecha Abajo" />
                            ) : (
                                <img src={flechaDerecha} alt="Flecha Derecha" />
                            )}
                            {dropdown2Open && (
                                <ul className="submenu">
                                    <li><a href="/firmafy">Firmafy</a></li>
                                    <li><a href="#">...</a></li>
                                    <li><a href="#">...</a></li>
                                </ul>
                            )}
                        </li>
                        <li><a href="/">...</a></li>
                        <li><a href="/">...</a></li>
                        <li><a href="/">...</a></li>
                    </ul>
                </div>

                <div>
                    <button className="buttonNavbar"><img src={lupa}/></button>
                    <button className="buttonNavbar"><img src={salir}/></button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
