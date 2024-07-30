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
                        <MoreInfo info='Aquí podrá visualizar una guía en el cuál se explica como funciona los diferentes apartados de Educación.'/>
                        <h1>¡Bienvenid@ a la guía de Educación!</h1>
                        <div className='guideSubContainer'>
                        <h2>Notas Medias</h2>
                        <p>En este apartado podrá visualizar las notas medias relacionadas a los cursos que han ido votando
                            los alumnos, se muestra la media global, la media por curso y las propias notas puestas por los alumnos.
                            Es recomendable ir actualizando las medias al menos una al dia para tener una información más actualizada.
                        </p>
                        <img src={guia4} alt="Refresh" />

                        <h3>Ver Reseñas</h3>
                        <p>
                            Para ver las reseñas de los usuarios bastará con pulsar la categoría deseada y se mostrarán todos los cursos relacionados, seleccionaremos el curso que querramos ver (con nota), y podremos visualizar una lista de reseñas en caso de que haya.
                        </p>
                            <img src={guia1} alt="Courses" />
                            <img src={guia2} alt="Reseñas" />

                        <h3>No veo las Medias</h3>
                        <p>
                            Puede ocurrir que no se muestren las medias, en este caso deberá pulsar sobre el botón "Actualizar Medias" para que se muestren las medias de los cursos.
                            Si sigue fallando se debe a que el servidor esta saturado, en este caso espere un par de minutos y vuelva a intentarlo.
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