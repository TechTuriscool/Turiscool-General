import React, { useState, useEffect } from 'react';
import './password.css';

const Password = () => {
    const [password, setPassword] = useState("");
    const [passwordIsCorrect, setPasswordIsCorrect] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
  
        if (inputPassword === correctPassword) {
            // Setear en el local storage que la contraseña es correcta
            localStorage.setItem("passwordIsCorrect", 'true');
            setPasswordIsCorrect(true);
        } else {
            document.querySelector('.error').innerText = "Contraseña incorrecta";
        }
    }

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    }

    // Si la contraseña es correcta, no mostrar el popup
    if (passwordIsCorrect) {
        return null;
    }

    return (
        <div className='popupBackground'>
            <div className='passwordPopup'>
                <h1>Introduzca la contraseña</h1>
                <div className='passwordInputContainer'>
                    <input 
                        type={showPassword ? "text" : "password"} 
                        id="password" 
                        name="password" 
                        placeholder='Introduzca la contraseña' 
                        required 
                    />
                    <button className="showPassword" type="button" onClick={toggleShowPassword}>
                        {showPassword ? <img src="https://cdn-icons-png.flaticon.com/128/8395/8395594.png" alt="Show Password Icon" /> : <img src="https://cdn-icons-png.flaticon.com/128/8442/8442580.png"/>}
                    </button>
                    <button onClick={verifyPassword}>Enviar</button>
                </div>
                <p className='error'></p>
            </div>
        </div>
    );
}

export default Password;
