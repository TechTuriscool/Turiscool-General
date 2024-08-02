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
import guia1 from '../../public/Guia-EducacionMediaNotas1.png';
import guia2 from '../../public/Guia-EducacionMediaNotas2.png';
import guia3 from '../../public/Guia-EducacionMediaNotas3.png';
import guia4 from '../../public/Guia-EducacionMediaNotas4.png';



const Educacion = () => {
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
                    <MoreInfo info='Aquí tienes una guía que explica cómo funcionan los diferentes apartados de Educación.'/>
                    <h1>¡Bienvenid@ a la guía de Educación!</h1>
                        <div className='guideSubContainer'>
                            <h2>Notas Medias</h2>
                            <p>En esta sección puedes ver las notas medias de los cursos votados por los alumnos. Se muestra la media global, la media por curso y las notas que han puesto los alumnos. Es buena idea actualizar las medias al menos una vez al día para tener la información al día.</p>
                            <img className='refresh' src={guia4} alt="Refresh" />
    
                            <h3>Ver Reseñas</h3>
                            <p>
                                Para ver las reseñas de los usuarios, simplemente selecciona la categoría que quieras y se mostrarán todos los cursos relacionados. Luego, elige el curso que te interese (con nota) y verás una lista de reseñas si las hay.
                            </p>
                            <img src={guia1} alt="Courses" />
                            <img src={guia2} alt="Reseñas" />
    
                            <h3>No veo las Medias</h3>
                            <p>
                                Si no ves las medias, pulsa el botón "Actualizar Medias" para que aparezcan. Si sigue sin funcionar, puede que el servidor esté saturado. En ese caso, espera unos minutos y vuelve a intentarlo.
                            </p>
                            <img src={guia3} alt="Reseñas" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Educacion;