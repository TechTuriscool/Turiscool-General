import React, { useState } from 'react';
import './firmafy.css';
import Navbar from '../../navbar/navbar';
import SideBar from '../../navbar/sidebar';
import MoreInfo from '../../moreInfo/moreInfo';


const App = () => {
  const [usersPHP, setUsersPHP] = useState([]);
  const [usersFirmafy, setUsersFirmafy] = useState([]);
  const [commonUsers, setCommonUsers] = useState([]);
  const baseURL = import.meta.env.VITE_BASE_URL;

  const getUsers = async () => {

    try {
      const response = await fetch(`${baseURL}/firmafy/`);
      const data = await response.json();
      setUsersPHP(data);
      console.log(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const getCSV = () => {
    return new Promise((resolve, reject) => {
      const inputFile = document.getElementById('fileInput').files[0];
      if (inputFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
          const text = e.target.result;
          const rows = text.split('\n').map(row => row.split(';').map(cell => cell.trim()));
          resolve(rows);
        };
        reader.onerror = function() {
          reject('Error al leer el archivo');
        };
        reader.readAsText(inputFile);
      } else {
        alert('Por favor, seleccione un archivo CSV.');
        reject('No se seleccionó ningún archivo');
      }
    });
  };

  const obtenerEmails = (rows) => {
    let emails = [];
    for (let i = 1; i < rows.length; i++) {
      let row = rows[i];
      if (row.length > 7 && row[7]) {
        emails.push(row[7]);
      }
    }
    console.log(emails);
    return emails;
  };

  const printRows = async (event) => {
    event.preventDefault();
    try {
      const rows = await getCSV();
      const emails = obtenerEmails(rows);
      setUsersFirmafy(emails);
      compararUsuarios(emails);

      // Obtener tabla y setear el display a block
      document.getElementById('tableContainer').style.display = 'block';

      document.getElementById('downloadBtnTxT').style.display = 'block';
      document.getElementById('downloadBtnCsv').style.display = 'block';
    } catch (error) {
      console.error(error);
    }
  };

  const compararUsuarios = (emails) => {
    let usuariosComunes = [];
    for (let i = 0; i < usersPHP.length; i++) {
      for (let j = 0; j < emails.length; j++) {
        if (usersPHP[i].correo === emails[j]) {
          usuariosComunes.push(usersPHP[i]);
        }
      }
    }
    setCommonUsers(usuariosComunes);
    console.log(usuariosComunes);
  };

  const downloadTxt = () => {
    let text = '';
    commonUsers.forEach(user => {
      text += `${user.correo}\t${user.link}\t${user.urlRecibiDiploma}\n`;
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_comunes.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCsv = () => {
    let text = '';
    commonUsers.forEach(user => {
      text += `${user.correo};${user.link};${user.urlRecibiDiploma}\n`;
    });
    const blob = new Blob([text], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'usuarios_comunes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  React.useEffect(() => {
    getUsers();
  }, []);

  const moreInfo = `Aquí puedes subir un archivo CSV con los correos de los alumnos que no han recibido un certificado de Firmafy.`;

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
              <div className='formContainer'>
                <div className='containerFirmafy'>
                  <MoreInfo info={moreInfo}/>
                <h1>Subir Archivo CSV</h1>
                <h3>Sube un CSV de alumnos y para verificar quien no tiene Certificados.</h3>
                <form id="csvForm" onSubmit={printRows}>
                  <div className='containerUnsuspend1'>
                      <input type="file" id="fileInput" name="fileInput" accept=".csv" />
                      <button type="submit">Subir</button>
                  </div>
                  <div id="tableContainer">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Correo</th>
                          <th>Link</th>
                          <th>Marca</th>
                        </tr>
                      </thead>
                      <tbody>
                        {commonUsers.map((user, index) => (
                          <tr key={index}>
                            <td>{user.correo}</td>
                            <td>{user.link}</td>
                            <td>{user.urlRecibiDiploma}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className='containerButtonDownload'>
                      <button type="button" id="downloadBtnTxT" onClick={downloadTxt} style={{ display: 'none' }}>
                      Descargar TXT
                      </button>
                      <button type="button" id="downloadBtnCsv" onClick={downloadCsv} style={{ display: 'none' }}>
                      Descargar CSV
                      </button>
                  </div>
                </form>
                </div>
              </div>
            </div>
        </div>
    </div>
  
  );
};

export default App;
