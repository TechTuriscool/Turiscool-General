import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from "../navbar/navbar.jsx";
import SideBar from "../navbar/sidebar.jsx";
import "./listarConversaciones.css";
import Conversaciones from '../conversaciones/conversaciones.jsx';
import Password from "../popups/password";
import LoadingGif from "../assets/Loading_2.gif";
import MoreInfo from '../moreInfo/moreInfo';
import CloseIcon from '../assets/close.svg'; 

const ListarConversaciones = () => {
    const [conversaciones, setConversaciones] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [popupConversacion, setPopupConversacion] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredConversaciones, setFilteredConversaciones] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    const conversacionesPerPage = 200;
    const baseURL = import.meta.env.VITE_BASE_URL;

    const cargarDatos = useCallback(async () => {
        try {
            const response = await fetch(`${baseURL}/wasapi-hubspot/recoger-conversaciones`, {
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
    }, []);

    useEffect(() => {
        cargarDatos();
    }, [cargarDatos]);

    const handleConversacionClick = (conversacion) => {
        // Verifica si la conversación seleccionada es la misma o diferente
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

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}`;
    };

    const getLatestMessageDate = (conversacion) => {
        if (conversacion.conversacion && conversacion.conversacion.length > 0) {
            const latestMessage = conversacion.conversacion.reduce((latest, mensaje) => {
                const currentDate = new Date(mensaje.created_at);
                return currentDate > new Date(latest.created_at) ? mensaje : latest;
            }, conversacion.conversacion[0]);
            return latestMessage.created_at;
        }
        return 'N/A';
    };

    const renderMensajeStatus = (status) => {
        if (status === 'read') {
            return <span className="status-icon">✔</span>;
        }
        return null;
    };

    const sortedConversaciones = useMemo(() => {
        return filteredConversaciones.sort((a, b) => {
            if (sortConfig.key) {
                let aValue = a[sortConfig.key] || '';
                let bValue = b[sortConfig.key] || '';
                
                if (sortConfig.key === 'latestMessageDate') {
                    aValue = getLatestMessageDate(a);
                    bValue = getLatestMessageDate(b);
                    aValue = new Date(aValue);
                    bValue = new Date(bValue);
                }

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            }
            return 0;
        });
    }, [filteredConversaciones, sortConfig]);

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
                        <MoreInfo info='Aquí puedes ver el historial de conversaciones de los usuarios de la plataforma WASAPI.'/>
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
                                            <th onClick={() => handleSort('first_name')}>Nombre {sortConfig.key === 'first_name' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th onClick={() => handleSort('phone')}>Teléfono {sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th className="tags" onClick={() => handleSort('tags')}>Tags {sortConfig.key === 'tags' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th onClick={() => handleSort('latestMessageDate')}>Último Mensaje {sortConfig.key === 'latestMessageDate' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentConversaciones.map((conversacion, index) => (
                                            <tr key={index} onClick={() => handleConversacionClick(conversacion)}> 
                                                <td>{conversacion.first_name}</td>
                                                <td>{conversacion.phone}</td>
                                                <td>{conversacion.email}</td>
                                                <td className="tags">{conversacion.tags}</td>
                                                <td>{getFormattedDate(getLatestMessageDate(conversacion))}</td>
                                            </tr>
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
                                <div className="popup-content3">
                                    <div className="popup-header">
                                        <h2>{popupConversacion.first_name} {popupConversacion.last_name}</h2>
                                        <h2 className='phonePopup'>{popupConversacion.phone}</h2>
                                        <span className="close" onClick={closePopup}>
                                            <img src={CloseIcon} alt="Cerrar" />
                                        </span>
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