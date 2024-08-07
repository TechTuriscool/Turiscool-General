import React from 'react';
import "./conversaciones.css";

const Conversaciones = ({ conversacion, onClick }) => {
    return (
        <tr className="conversacion-row" onClick={onClick}>
            <td>{conversacion.first_name} {conversacion.last_name}</td>
            <td>{conversacion.phone}</td>
            <td>{conversacion.email}</td>
            <td>{conversacion.tags}</td>
        </tr>
    );
};

export default Conversaciones;
