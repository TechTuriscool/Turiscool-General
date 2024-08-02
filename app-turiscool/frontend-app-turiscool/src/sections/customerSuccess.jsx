import React from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import Password from '../popups/password';
import DropDown from '../navbar/dropDown';
import './sections.css';
import MoreInfo from '../moreInfo/moreInfo';
import imgExport from '../../public/exportUsers.png';
import imgListadoOk from '../../public/listadoOk.png';
import guiaDescargarFirmafy from '../../public/Guia-DescargarCSVdesdeFirmafy.png';

const customerSuccess = () => {
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
          <div className='guideContainer'>
            <MoreInfo info='Aquí tienes una guía que explica cómo funcionan los diferentes apartados de Customer Success.'/>
            <h1>¡Bienvenid@ a la guía de Customer Success!</h1>
            <div className='guideSubContainer'>
              <h2>Comprobar Firmafy</h2>
              <p>En esta sección puedes comprobar qué alumnos han firmado un documento de Firmafy que se les ha enviado. Para hacerlo, primero debes crear un fichero en formato CSV o descargarlo desde Firmafy, como el que se muestra a continuación.</p>
              <a href="/2024-07-23_ExportUsers.csv" download>
                <img src={imgListadoOk} alt="Listado Ok" />
              </a>
              <h5>Pulsa sobre la imagen</h5>
              <h3>Descargar CSV desde Firmafy</h3>
              <p>Para descargar un fichero CSV, ve a la sección de "Envíos Realizados", selecciona "Enviado" en "Filtros" y aplica el filtro. Una vez hecho esto, solo tienes que descargar el CSV pulsando en "Exportar".</p>
              <img src={guiaDescargarFirmafy} alt="Listado Ok" />
            </div>
            <div className='guideSubContainer'>
              <h2>Desuspender</h2>
              <p>En esta sección puedes desuspender a varios usuarios de diferentes maneras, ya sea adjuntando un fichero CSV o indicando los correos electrónicos manualmente.</p>
              <a href="/listadoOK.csv" download>
                <img src={imgExport} alt="Exportar Usuarios" />
              </a>
              <h5>Pulsa sobre la imagen</h5>
            </div>
            <div className='guideSubContainer'>
              <h2>Comprobar Progreso</h2>
              <p>En esta sección puedes ver el progreso de un curso mediante etiquetas, de forma que se pueda filtrar información a partir de dos etiquetas. Si solo tienes una, basta con repetir la misma etiqueta en los dos inputs. <strong>En caso de error, espera un rato y recarga la página.</strong></p>              
            </div>
          </div>
        </div>
      </div>
    </div>
  ); 
}

export default customerSuccess;
