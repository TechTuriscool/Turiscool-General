import React, { useState } from 'react';
import Password from "../popups/password";
import Navbar from "../navbar/navbar.jsx";
import SideBar from "../navbar/sidebar.jsx";
import loading from "../assets/Loading_2.gif";
import MoreInfo from '../moreInfo/moreInfo.jsx';
import CollapsibleSection from '../collapse/CollapsibleSection.jsx';
import "./actualizarContactos.css";

const ActualizarContactos = () => {
    const [contactos, setContactos] = useState([]);
    const [totalContactos, setTotalContactos] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const baseURL = import.meta.env.VITE_BASE_URL;

    const obtenerContactos = async () => {
        setIsLoading(true);

        const response = await fetch(`${baseURL}/wasapi-hubspot/update-contacts`, {
            method: 'POST'
        });

        let result = await response.json();
        console.log(result);

        setContactos(result);
        setTotalContactos(result.length);
        setIsLoading(false);
    }

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
                    <CollapsibleSection title="Crear Contacto">
                    </CollapsibleSection>

                    <CollapsibleSection title="Actualizar contactos">
                        <div className='containerUpdateContacts'>
                            <MoreInfo info="Desde aquí puedes actualizar la lista de contactos de HubSpot para sincronizar los números de teléfono con los datos de WASAPI" />
                            <button className='buttonContactsUpdate' onClick={obtenerContactos} disabled={isLoading}>
                                {isLoading ? "Actualizando..." : "Actualizar contactos"}
                            </button>
                            {isLoading && <img src={loading} alt="Cargando..." />}
                            {totalContactos === 0 && (
                                <h2>No hay contactos para actualizar</h2>
                            )}
                            {totalContactos > 0 && (
                                <div>
                                    <p>Total de contactos actualizados: {totalContactos}</p>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>Email</th>
                                                <th>Teléfono</th>
                                                <th>HubSpot ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {contactos.map((contacto, index) => (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    <td>{contacto.email}</td>
                                                    <td>{contacto.phone}</td>
                                                    <td>{contacto.hubspotId}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </CollapsibleSection>
                </div>
            </div>
        </div>
    );
}

export default ActualizarContactos;
