import React from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import Password from '../popups/password';
import DropDown from '../navbar/dropDown';
import './sections.css';
import MoreInfo from '../moreInfo/moreInfo';
import guiaWasapi from '../assets/Guia-conversacion-wasapi.png';


const Educacion = () => {
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
                <div className="dropDownContainer">
                    <DropDown />
                </div>
                <div className="rightBottomContainer2">
                    <div className='guideContainer'>
                    <MoreInfo info='Aquí tienes una guía que explica cómo funcionan los diferentes apartados de HubSpot.'/>
                    <h1>¡Bienvenid@ a la guía de HubSpot!</h1>
                        <div className='guideSubContainer'>
                            <h2>Conversaciones Wasapi</h2>
                            <p>En esta sección puedes ver todo el historial de conversaciones de los usuarios de la plataforma WASAPI. Puedes ver información personal como los nombres y apellidos, teléfono entre otros más.</p>
                            <img src={guiaWasapi}/>
                            <h3>Extras</h3>
                            <p>Cuenta con una barra de búsqueda para poder filtrar por télefono o nombre, los usuarios se muestrán de 50 en 50, por lo que tienes que pulsar los botones de <strong>"Siguiente"</strong> y <strong>"Anterior"</strong> para poder ver los 50 siguientes.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Educacion;