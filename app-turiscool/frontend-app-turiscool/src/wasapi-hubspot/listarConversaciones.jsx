import React, { useState, useEffect } from 'react';
import Navbar from "../navbar/navbar.jsx";
import SideBar from "../navbar/sidebar.jsx";
import "./listarConversaciones.css";
import Conversaciones from '../conversaciones/conversaciones.jsx';
import Password from "../popups/password";
import LoadingGif from "../assets/Loading_2.gif";
import MoreInfo from '../moreInfo/moreInfo';

const ListarConversaciones = () => {
    const [conversaciones, setConversaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [popupConversacion, setPopupConversacion] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredConversaciones, setFilteredConversaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 

    const conversacionesPerPage = 50;

    const cargarDatos = async () => {
        try {
            const response = await fetch('http://localhost:3001/wasapi-hubspot/recoger-conversaciones', {
                method: 'GET'
            });
            const result = await response.json();
            setConversaciones(result);
            setFilteredConversaciones(result); 
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false); 
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    const handleConversacionClick = (conversacion) => {
        setPopupConversacion(conversacion);
    };

    const closePopup = () => {
        setPopupConversacion(null);
    };

    const handleSearch = () => {
        const filtered = conversaciones.filter(conversacion => {
            const firstName = conversacion.first_name || "";
            const lastName = conversacion.last_name || "";
            const phone = conversacion.phone || "";

            const normalizedFirstName = firstName.trim() ? firstName.toLowerCase() : "";
            const normalizedLastName = lastName.trim() ? lastName.toLowerCase() : "";
            
            return normalizedFirstName.includes(searchTerm.toLowerCase()) ||
                   normalizedLastName.includes(searchTerm.toLowerCase()) ||
                   phone.includes(searchTerm);
        });

        setFilteredConversaciones(filtered);
        setCurrentPage(1);
    };

    const renderMensajeStatus = (status) => {
        if (status === 'read') {
            return <span className="status-icon">✔</span>;
        }
        return null;
    };

    const sortedConversaciones = filteredConversaciones.sort((a, b) => {
        const dateA = new Date(a.conversacion[0]?.created_at || 0);
        const dateB = new Date(b.conversacion[0]?.created_at || 0);
        return dateA - dateB;
    });

    const indexOfLastConversacion = currentPage * conversacionesPerPage;
    const indexOfFirstConversacion = indexOfLastConversacion - conversacionesPerPage;
    const currentConversaciones = sortedConversaciones.slice(indexOfFirstConversacion, indexOfLastConversacion);

    const nextPage = () => {
        if (currentPage < Math.ceil(sortedConversaciones.length / conversacionesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const sortedPopupMessages = (messages) => {
        return messages.sort((a, b) => {
            const dateA = new Date(a.created_at || 0);
            const dateB = new Date(b.created_at || 0);
            return dateA - dateB; 
        });
    };

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
                        <div className="listar-conversaciones">
                        <MoreInfo info = 'Aquí puedes ver el historial de conversaciones de los usuarios de la plataforma WASAPI.'/>
                            <h1>Listar Conversaciones</h1>

                            <div className="search-container">
                                <input 
                                    type="text" 
                                    placeholder="Buscar por nombre o teléfono" 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    className="search-bar"
                                />
                                <button onClick={handleSearch} className="search-button">Buscar</button>
                            </div>

                            {isLoading ? (
                                <div className="loading-container">
                                    <img src={LoadingGif} alt="Loading..." className="loading-gif" />
                                </div>
                            ) : (
                                <>
                                    <table className="conversaciones-table">
                                        <thead>
                                            <tr>
                                                <th>Nombre</th>
                                                <th>Teléfono</th>
                                                <th>Email</th>
                                                <th>Tags</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentConversaciones.map((conversacion, index) => (
                                                <Conversaciones 
                                                    key={index} 
                                                    conversacion={conversacion} 
                                                    onClick={() => handleConversacionClick(conversacion)} 
                                                />
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="pagination">
                                        <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                                        <button onClick={nextPage} disabled={currentPage === Math.ceil(sortedConversaciones.length / conversacionesPerPage)}>Siguiente</button>
                                    </div>
                                </>
                            )}

                            {popupConversacion && (
                                <div className="popup">
                                    <div className="popup-content">
                                        <div className="popup-header">
                                            <h2>{popupConversacion.first_name} {popupConversacion.last_name}</h2>
                                            <h2 className='phonePopup'>{popupConversacion.phone}</h2>
                                            <span className="close" onClick={closePopup}>&times;</span>
                                        </div>
                                        <div className="mensajes">
                                            {popupConversacion.conversacion && sortedPopupMessages(popupConversacion.conversacion)
                                                .map((mensaje, index) => (
                                                    <div key={index} className={`mensaje ${mensaje.type} ${mensaje.status === 'read' ? 'read' : ''}`}>
                                                        <div>
                                                            <p>{mensaje.message}</p>
                                                            <p>{mensaje.reactions}</p>
                                                            <p className={`date-time ${mensaje.type}`}>
                                                                <strong>{new Date(mensaje.created_at).toLocaleString()}</strong>
                                                            </p>
                                                        </div>
                                                        {renderMensajeStatus(mensaje.status)}
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListarConversaciones;
