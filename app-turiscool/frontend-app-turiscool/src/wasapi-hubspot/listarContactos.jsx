import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import Password from '../popups/password';
import DropDown from '../navbar/dropDown';
import './listarContactos.css';
import MoreInfo from '../moreInfo/moreInfo';
import LoadingGif from "../assets/Loading_2.gif"; 
import CloseIcon from "../assets/close.svg";
import papelera from "../assets/papelera.svg";
import editar from "../assets/editar.svg";

const ListarContactos = () => {
    const baseURL = import.meta.env.VITE_BASE_URL;
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true); 
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false); // Estado para el popup de edición

    const usersPerPage = 200;

    const getUsers = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${baseURL}/hubspot/users`);
            const data = await response.json();
            console.log('Users:', data);
            setUsers(data);
            setFilteredUsers(data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setIsLoading(false);
        }
    }, [baseURL]);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    const handleNameClick = (user) => {
        setSelectedUser(user);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedUser(null);
    };

    const handleSearch = () => {
        const filtered = users.filter(user => {
            const firstName = user.properties.firstname || "";
            const lastName = user.properties.lastname || "";
            const phone = user.properties.phone || "";
            const email = user.properties.email || "";

            return firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                   phone.includes(searchTerm) ||
                   email.toLowerCase().includes(searchTerm.toLowerCase());
        });

        setFilteredUsers(filtered);
        setCurrentPage(1);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const handleDeleteUser = async (userId, userName) => {
        const isConfirmed = window.confirm(`¿Estás seguro de que quieres eliminar el usuario ${userName}? Esta acción no se puede deshacer.`);
    
        if (!isConfirmed) {
            return;
        }
    
        console.log('Deleting user:', userId);
        try {
            await fetch(`${baseURL}/hubspot/users/${userId}`, {
                method: 'DELETE',
            });
            setUsers(users.filter(user => user.id !== userId));
            setFilteredUsers(filteredUsers.filter(user => user.id !== userId));
            alert('Usuario eliminado correctamente. Debes esperar 24 horas para ver los cambios reflejados en esta plataforma.');
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setIsEditPopupOpen(true); // Abre el popup de edición
    };

    const handleCloseEditPopup = () => {
        setIsEditPopupOpen(false);
        setSelectedUser(null);
    };

    const handleSaveEdit = async () => {
        if (!selectedUser) return;

        try {
            const response = await fetch(`${baseURL}/hubspot/users/${selectedUser.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    properties: selectedUser.properties,
                }),
            });

            if (response.ok) {
                const updatedUsers = users.map(user => 
                    user.id === selectedUser.id ? selectedUser : user
                );
                setUsers(updatedUsers);
                setFilteredUsers(updatedUsers);
                alert('Usuario actualizado correctamente.');
                handleCloseEditPopup();
            } else {
                console.error('Error updating user');
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleEditChange = (field, value) => {
        setSelectedUser({
            ...selectedUser,
            properties: {
                ...selectedUser.properties,
                [field]: value,
            },
        });
    };

    const sortedUsers = useMemo(() => {
        return filteredUsers.sort((a, b) => {
            if (sortConfig.key) {
                let aValue = a.properties[sortConfig.key] || '';
                let bValue = b.properties[sortConfig.key] || '';

                if (sortConfig.direction === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            }
            return 0;
        });
    }, [filteredUsers, sortConfig]);

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

    const nextPage = () => {
        if (currentPage < Math.ceil(sortedUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
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
                <div className="dropDownContainer">
                    <DropDown />
                </div>
                <div className="rightBottomContainer2">
                    <div className='listar-contactos'>
                        <MoreInfo info='Aquí puedes ver el historial de contactos de los usuarios de la plataforma.'/>
                        <h1>Contactos</h1>

                        <div className="search-container">
                            <input 
                                type="text" 
                                placeholder="Buscar por nombre, teléfono o email" 
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
                                <table>
                                    <thead>
                                        <tr>
                                            <th onClick={() => handleSort('ID')}>ID {sortConfig.key === 'ID' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th onClick={() => handleSort('firstname')}>Nombre{sortConfig.key === 'firstname' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th onClick={() => handleSort('lastname')}>Apellidos{sortConfig.key === 'lastname' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th onClick={() => handleSort('phone')}>Teléfono{sortConfig.key === 'phone' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th onClick={() => handleSort('email')}>Email{sortConfig.key === 'email' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : ''}</th>
                                            <th></th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentUsers.map((user, index) => (
                                            <tr key={index}>
                                                <td onClick={() => handleNameClick(user)}>{user.id}</td>
                                                <td onClick={() => handleNameClick(user)}>{user.properties.firstname}</td>
                                                <td onClick={() => handleNameClick(user)}>{user.properties.lastname}</td>
                                                <td onClick={() => handleNameClick(user)}>{user.properties.phone}</td>
                                                <td onClick={() => handleNameClick(user)}>{user.properties.email}</td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleEditUser(user)} 
                                                        className="edit-button"
                                                    >
                                                        <img src={editar} />
                                                    </button>
                                                </td>
                                                <td>
                                                    <button 
                                                        onClick={() => handleDeleteUser(user.id, user.properties.firstname)} 
                                                        className="delete-button"
                                                    >
                                                        <img src={papelera} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <div className="pagination">
                                    <button onClick={prevPage} disabled={currentPage === 1}>Anterior</button>
                                    <button onClick={nextPage} disabled={currentPage === Math.ceil(sortedUsers.length / usersPerPage)}>Siguiente</button>
                                </div>
                            </>
                        )}

                        {/* Popup de detalles */}
                        {showPopup && selectedUser && (
                            <div className="popup">
                                <div className="popup-content3">
                                    <div className="popup-header">
                                        <h2>User Details</h2>
                                        <span className="close" onClick={handleClosePopup}>
                                            <img src={CloseIcon} alt="Cerrar" />
                                        </span>
                                    </div>
                                    <div className="user-details-card">
                                        {Object.entries(selectedUser.properties).map(([key, value]) => {
                                            if (value === null || value === undefined || value === "") {
                                                return null;
                                            } else {
                                                return (
                                                    <div key={key} className="user-detail-item">
                                                        <strong className="detail-key">{key}:</strong> 
                                                        <span className="detail-value">{value}</span>
                                                    </div>
                                                );
                                            }
                                        })}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Popup de edición */}
                        {isEditPopupOpen && selectedUser && (
                            <div className="popup">
                                <div className="popup-content3">
                                    <div className="popup-header">
                                        <h2>Editar Usuario</h2>
                                        <span className="close" onClick={handleCloseEditPopup}>
                                            <img src={CloseIcon} alt="Cerrar" />
                                        </span>
                                    </div>
                                    <div className="edit-user-form">
                                        <label>
                                            Nombre:
                                            <input 
                                                type="text" 
                                                value={selectedUser.properties.firstname || ""} 
                                                onChange={(e) => handleEditChange('firstname', e.target.value)} 
                                            />
                                        </label>
                                        <label>
                                            Apellidos:
                                            <input 
                                                type="text" 
                                                value={selectedUser.properties.lastname || ""} 
                                                onChange={(e) => handleEditChange('lastname', e.target.value)} 
                                            />
                                        </label>
                                        <label>
                                            Teléfono:
                                            <input 
                                                type="text" 
                                                value={selectedUser.properties.phone || ""} 
                                                onChange={(e) => handleEditChange('phone', e.target.value)} 
                                            />
                                        </label>
                                        <label>
                                            Email:
                                            <input 
                                                type="email" 
                                                value={selectedUser.properties.email || ""} 
                                                onChange={(e) => handleEditChange('email', e.target.value)} 
                                            />
                                        </label>
                                        <button onClick={handleSaveEdit} className="save-button">Guardar</button>
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

export default ListarContactos;
