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
            <MoreInfo info='Aquí podrá visualizar una guía en el cuál se explica como funciona los diferentes apartados de Customer Success.'/>
            <h1>¡Bienvenid@ a la guía de Customer Success!</h1>
            <div className='guideSubContainer'>
              <h2>Comprobar Firmafy</h2>
              <p>En este apartado podrá comprobar que alumnos han firmado un documento de Firmafy el cual se le ha enviado,
                 para ello deberás primera crear un fichero en formato CSV o descargarlo desde Firmafy, como el que se muestra a continuación.</p>
              <a href="/2024-07-23_ExportUsers.csv" download>
                <img src={imgListadoOk} alt="Listado Ok" />
              </a>
              <h5>Pulse sobre la imagen</h5>
              <h3>Descargar CSV desde Firmafy</h3>
              <p>Para descargar un fichero csv nos deberemos dirigir al apartado de "Envíos Realizados", seleccionar en "Filtros" la opción "Enviado" y aplicaremos el filtro, una vez hecho solo deberemos descargar el csv pulsando sobre "Exportar".</p>
              <img src={guiaDescargarFirmafy} alt="Listado Ok" />
            </div>
            <div className='guideSubContainer'>
              <h2>Desuspender</h2>
              <p>En este apartado podrá desuspender a múltiples usuarios de diferentes maneras, ya sea adjuntando un fichero .csv como indicando los correos eléctronicos manualmente.</p>
              <a href="/listadoOK.csv" download>
                <img src={imgExport} alt="Exportar Usuarios" />
              </a>
              <h5>Pulse sobre la imagen</h5>
            </div>
            <div className='guideSubContainer'>
              <h2>Comprobar Progreso</h2>
              <p>En este apartado podrá visualizar el progreso de un curso mediante etiquetas de manera de que se pueda filtrar información a partir de dos etiquetas, en caso de que solo dispongamos de una bastará con repetir la misma tag en los dos inputs. <strong>En caso de error, esperar un rato y recargar la página.</strong></p>              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default customerSuccess;
