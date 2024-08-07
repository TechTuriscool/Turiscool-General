import React, { useState, useEffect, useRef } from 'react';
import './sidebar.css';
import salir from "../assets/salir.svg";
import DropDown from './dropDown';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const SideBar = () => {
    const [dropDownVisible, setDropDownVisible] = useState(false);
    const [selectedAlt, setSelectedAlt] = useState('');
    const dropDownRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    
    const buttonsTop = [
        { text: 'Educación', alt: 'educacion', path: '/educacion/' },
        { text: 'Customer Success', alt: 'customer-success', path: '/customer-success/' },
        { text: 'HubSpot', alt: 'hubspot', path: '/hubspot/' },
        { text: 'Archivos', alt: 'files', path: '/files' },
        { text: 'Guía de uso', alt: 'guide', path: '/guide' }
    ];

    const menuBlack = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z" fill="#000000"></path></g></svg>`;
    const menuWhite = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM3 12C3 11.4477 3.44772 11 4 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H4C3.44772 13 3 12.5523 3 12ZM3 18C3 17.4477 3.44772 17 4 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H4C3.44772 19 3 18.5523 3 18Z" fill="#ffffff"></path> </g></svg>`;

    const logout = () => {
        localStorage.removeItem('passwordIsCorrect');
        window.location.href = "/";
    }

    const openLink = (event) => {
        const alt = event.currentTarget.querySelector('img').alt;
        setSelectedAlt(alt);

        // Recoger el path actual
        const path = location.pathname.split('/')[1];
        //console.log("ruta actual " + path);
        //console.log(alt)
        if (alt === path) {
            setDropDownVisible(!dropDownVisible);
        } else {
            navigate(buttonsTop.find(button => button.alt === alt).path);
        }
    };

    const handleClickOutside = (event) => {
        if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
            setDropDownVisible(false);
        }
    };

    useEffect(() => {
        if (dropDownVisible) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropDownVisible]);

    useEffect(() => {
        const currentPath = location.pathname.split('/')[1];
        const matchedButton = buttonsTop.find(button => currentPath === button.alt);
        if (matchedButton) {
            setSelectedAlt(matchedButton.alt);
        } else {
            setSelectedAlt('');
        }
    }, [location.pathname]);

    return (
        <div className='sideBarContainerButtons'>
            <div className='containerButtonsTop'>
                {buttonsTop.map((button, index) => (
                    <div
                        key={index}
                        className={`buttonSideBar ${selectedAlt === button.alt ? 'active' : ''}`}
                        onClick={openLink}
                    >
                        <img src={`data:image/svg+xml;utf8,${encodeURIComponent(selectedAlt === button.alt ? menuWhite : menuBlack)}`} alt={button.alt} />
                        <p style={{ color: selectedAlt === button.alt ? '#fff' : '#333' }}>{button.text}</p>
                    </div>
                ))}
            </div>
            {dropDownVisible && (
                <div ref={dropDownRef}>
                    <DropDown/>
                </div>
            )}
            <div className='containerButtonsBottom'>
                <div className='buttonSideBar' onClick={logout}>
                    <img src={salir} alt='Cerrar Sesión' />
                    <p>Cerrar Sesión</p>
                </div>
            </div>
        </div>
    );
}

export default SideBar;
