import React from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import Password from '../popups/password';
import DropDown from '../navbar/dropDown';
import './sections.css';
import MoreInfo from '../moreInfo/moreInfo';


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
                    <MoreInfo info='Aquí tienes una guía que explica cómo funcionan los diferentes apartados de la administración de usuarios.'/>
                    <h1>¡Bienvenid@ a la guía de Usuarios!</h1>
                        <div className='guideSubContainer'>
                            <h2>Actualizar Contactos</h2>
                            <p>Este apartado tiene como objetivo poder ir actualizando los datos personales <strong>(número de teléfono)</strong> de Wasapi a Hubspot, de forma que al pulsar el botón se irán actualizando a todos aquellos cuyo correo electrónico coincidan. 
                                Es importante aclarar que hay que esperar a que todos estos datos se vayan actualizando antes de salir.
                            </p>
                            <h3></h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Educacion;