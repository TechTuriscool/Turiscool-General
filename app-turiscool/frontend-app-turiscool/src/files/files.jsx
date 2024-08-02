import { React, useState } from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import Password from '../popups/password';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './files.css';
import MoreInfo from '../moreInfo/moreInfo';

const Files = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const baseURL = import.meta.env.VITE_BASE_URL;

  const handleUnsuspend = async () => {
    const formData = new FormData();
    formData.append('file', file);

    if (!file) {
      toast.error('Debes subir un archivo');
      return;
    }

    try {
      const response = await fetch(`${baseURL}/files/upload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ file: file }),
      });

      if (response.ok) {
        toast.success('Usuarios suspendidos dados de alta correctamente');
      } else {
        toast.error('Error al desuspender usuarios');
      }
    } catch (error) {
      toast.error('Error: ' + error.message);
    }
  };

  const infoButton = `Esta utilidad te permite volver a recuperar usuarios suspendidos en masa y no tener que ir 1 a 1 en LW. Para ello necesitas un CSV de alumnos descargado desde LearnWorlds o introducir los mails separados por comas. En cualquiera de los dos casos, deberás pulsar sobre el botón "Desuspender" para desbloquear a los usuarios.`;

  /* <div id="menuContainer">
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
            <h1>Subir Archivos a Drive</h1>
            <h3>Sube el contenido que quieras añadir a la lista de documentación.</h3>
            <div className="containerUnsuspend1">
              <input type="file" id="file" onChange={handleFileChange} />
              <button className='upload' onClick={handleUnsuspend}>Subir</button>
            </div>
          </div>
        </div>
      </div>
    </div> */
  return (
    <div id="menuContainer">
    <div className="menuTopContainer">
        <Navbar />
    </div>
    <div className="menuBottomContainer">
        <div className="leftBottomContainer">
            <SideBar /> 
        </div>
        <div className="rightBottomContainer">
            <h1 className='temporalText'>En desarrollo</h1>
            <img className='temporalImage' src="https://static-00.iconduck.com/assets.00/web-developer-illustration-1004x1024-wcqgbag3.png" alt="desarrollo" />
        </div>
    </div>
</div>
  );
};

export default Files;
