import { React, useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import logo from "../assets/logo.png";
import "./navbar.css";
import flechaAbajo from "../assets/flecha abajo.svg";
import flechaDerecha from "../assets/flecha derecha.svg";
import lupa from "../assets/lupa.svg";

const Navbar = () => {
    const [dropdown1Open, setDropdown1Open] = useState(false);
    const [dropdown2Open, setDropdown2Open] = useState(false);
    const dropdownRef1 = useRef(null);
    const dropdownRef2 = useRef(null);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        console.log('Logo clicked'); 
        navigate('/');
    };

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
    /*
    useEffect(() => {
        const currentLocation = window.location.pathname;
        const menuItems = document.querySelectorAll('.menuNavbar ul li');
        console.log(currentLocation);
        
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            const href = link.getAttribute('href');
            
            // Obtener la primera mitad de la URL hasta "/educacion/average"
            const firstHalfCurrent = currentLocation.split('/educacion/average')[0];
            
            if (href && currentLocation.startsWith(href) || firstHalfCurrent.startsWith(href)) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }, []);
    */

    const toggleDropdown1 = () => {
        setDropdown1Open(!dropdown1Open);
    };

    const toggleDropdown2 = () => {
        setDropdown2Open(!dropdown2Open);
    };

    const showSearchInput = () => {
        const searchInput = document.querySelector('.searchContainer input');

        if (searchInput.style.visibility === 'visible') {
            searchInput.style.visibility = 'hidden';
        } else if (searchInput.style.visibility === 'hidden') {
            searchInput.style.visibility = 'visible';
        }
    }

    /* 
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
            <li><a href="/">Guía de uso</a></li>
        </ul>
        
            <button className="buttonNavbar"><img src={lupa}/></button>
    </div>
    */

    return (
        <nav>
            <div className="navbar">
                <img className="imgNavbar" src={logo} alt="Logo" onClick={handleLogoClick} />
                <div className="searchContainer">
                    <input placeholder="Turiscool" type="text"/>
                    <button className="buttonNavbar" onClick={showSearchInput}><img src={lupa}/></button>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
