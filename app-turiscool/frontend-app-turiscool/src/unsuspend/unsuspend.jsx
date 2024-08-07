import { React, useState } from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import Password from '../popups/password';
import FormData from 'form-data';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './unsuspend.css';
import MoreInfo from '../moreInfo/moreInfo';

const App = () => {
  const [file, setFile] = useState(null);
  const [mails, setMails] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleMailsChange = (event) => {
    setMails(event.target.value);
  };

  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${baseURL}/unsuspend/upload`, {
        method: 'POST',
        body: formData,
      });


      if (response.ok) {
        console.log('File uploaded successfully');
      } else {
        console.error('Error uploading file');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleUnsuspend = async () => {
    if (!file && !mails) {
      toast.error('Debes subir un archivo o introducir los mails');
      return;
    } else {
      // Verificar que los mails no contienen espacios y tienen el formato correcto
      if (mails && mails.includes(' ')) {
        toast.error('Los correos no deben contener espacios');
        return;
      } else if (mails) {
        for (const mail of mails.split(',')) {
          if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(mail.trim())) {
            toast.error('El correo no es válido');
            return;
          }
        }
      }

      try {
        const response = await fetch(`${baseURL}/unsuspend`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ mails }),
        });

        if (response.ok) {
          toast.success('Usuarios suspendidos dados de alta correctamente');
        } 
      } catch (error) {
        toast.error('Error: ' + error.message);
      }
    }
  };

  const infoButton = `Esta utilidad te permite volver a recuperar usuarios suspendidos en masa y no tener que ir 1 a 1 en LW. Para ello necesitas un CSV de alumnos descargado desde LearnWorlds o introducir los mails separados por comas.
                    En cualquiera de los dos casos, deberás pulsar sobre el botón "Desuspender" para desbloquear a los usuarios.`

  return (
    <div id="menuContainer">
        <Password />
        <ToastContainer />
        <div className="menuTopContainer">
            <Navbar />
        </div>
        <div className="menuBottomContainer">
            <div className="leftBottomContainer">
                <SideBar /> 
            </div>
            <div className="rightBottomContainer">
              <div className='unsuspendContainer'>
                <MoreInfo info={infoButton} />
                <h1>Desuspender Usuarios en Masa</h1>
                <div className="subtitle">
                </div>

                <h3>Sube un CSV de alumnos descargado desde learnWorlds</h3>
                <div className="containerUnsuspend1">
                  <input type="file" id="file" onChange={handleFileChange} />
                  <button id="upload" onClick={handleUpload}>Subir</button>
                </div>

                <div className="containerUnsuspend">
                  <textarea id="mails" placeholder='Introduce los mails separados por comas' className="text-input" value={mails} onChange={handleMailsChange}></textarea>
                </div>
                <div className='unsunsuspend-button-container'>
                  <button id="unsuspend" className="unsuspend-button" onClick={handleUnsuspend}>Desuspender</button> 
                </div>
              </div>
            </div>
        </div>
    </div>
    
  );
};

export default App;
