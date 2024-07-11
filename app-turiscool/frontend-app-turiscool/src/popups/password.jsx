import React, { useState, useEffect } from 'react';
import './password.css';

const Password = () => {
    const [password, setPassword] = useState("");
    const [passwordIsCorrect, setPasswordIsCorrect] = useState(false);

    useEffect(() => {
        // Verificar si la contraseña ya es correcta en localStorage
        const isPasswordCorrect = localStorage.getItem("passwordIsCorrect") === 'true';
        setPasswordIsCorrect(isPasswordCorrect);
    }, []);

    const verifyPassword = () => {
        const inputPassword = document.getElementById("password").value;
        setPassword(inputPassword);
        
        // Recoger contraseña de las variables de entorno
        const correctPassword = import.meta.env.VITE_PASSWORD;

        console.log("Contraseña introducida: " + inputPassword);
        console.log("Contraseña correcta: " + correctPassword);
  
        if (inputPassword === correctPassword) {
            // Setear en el local storage que la contraseña es correcta
            localStorage.setItem("passwordIsCorrect", 'true');
            setPasswordIsCorrect(true);
        } else {
            alert("Contraseña incorrecta");
        }
    }

    // Si la contraseña es correcta, no mostrar el popup
    if (passwordIsCorrect) {
        return null;
    }

    return (
        <div className='popupBackground'>
            <div className='passwordPopup'>
                <h1>Introduzca la contraseña de acceso</h1>
                <div>
                    <label htmlFor="password">Contraseña:</label>
                    <input type="password" id="password" name="password" required />
                    <button onClick={verifyPassword}>Enviar</button>
                </div>
            </div>
        </div>
    );
}

export default Password;
