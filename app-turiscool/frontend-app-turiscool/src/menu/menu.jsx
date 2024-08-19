import "./menu.css";
import logo from "../assets/logo.png";
import Password from "../popups/password";
import Navbar from "../navbar/navbar.jsx";
import SideBar from "../navbar/sidebar.jsx";
import MoreInfo from "../moreInfo/moreInfo.jsx";

function Menu() {
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
                <div className="rightBottomContainer">
                <div className='guideContainer'>
                    <h1>¡Bienvenid@ a la APP de Turiscool!</h1>
                    <div className='guideSubContainer'>

                        <h2>Educación</h2>
                        <p>En esta sección, tendrás la posibilidad de revisar la satisfacción media de los cursos, tanto a nivel de categorías como de forma global. Además, podrás acceder a información detallada sobre cada curso.</p>

                        <h2>Customer Success</h2>
                        <p>Aquí encontrarás herramientas como Firmafy, la opción de Unsuspend, y seguimiento del progreso de formularios. Cada funcionalidad está explicada de manera detallada dentro de la sección correspondiente.</p>

                        <h2>HubSpot</h2>
                        <p>En la sección de HubSpot, podrás gestionar contactos, revisar conversaciones y actualizar información de contactos. Todas estas funciones cuentan con explicaciones detalladas en su respectiva área.</p>

                        <h2>Archivos</h2>
                        <p>En esta sección, podrás gestionar los archivos de la aplicación, descargando guías o subiendo las tuyas propias. (Funcionalidad en desarrollo)</p>
                        <h3></h3>
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );

    //                    
    //                    


}

export default Menu;
