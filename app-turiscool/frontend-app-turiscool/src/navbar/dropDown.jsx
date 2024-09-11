import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./dropDown.css";

const DropDown = () => {
    const [content, setContent] = useState(null);
    const alt = window.location.pathname.split('/')[1];
    const alt2 = window.location.pathname.split('/')[2];
    const location = useLocation();

    useEffect(() => {
        switch (alt) {
            case 'educacion':
                setContent(
                    <Link to='/educacion/average' className='buttonDropDown'>
                        <p style={{color: location.pathname.includes('average') ? '#fff' : '#333', background: location.pathname.includes('average') ? '#006791' : '#fff'}}>Notas Medias</p>
                    </Link>
                );
                break;
            case 'customer-success':
                setContent(
                    <>
                        <Link to='/customer-success/firmafy' className='buttonDropDown'>
                            <p style={{color: location.pathname.includes('firmafy') ? '#fff' : '#333', background: location.pathname.includes('firmafy') ? '#006791' : '#fff'}}>Comprobar Firmafy</p>
                        </Link>
                        <Link to='/customer-success/unsuspend' className='buttonDropDown'>
                            <p style={{color: location.pathname.includes('unsuspend') ? '#fff' : '#333', background: location.pathname.includes('unsuspend') ? '#006791' : '#fff'}}>Desuspender</p>
                        </Link>
                        <Link to='/customer-success/progress' className='buttonDropDown'>
                            <p style={{color: location.pathname.includes('progress') ? '#fff' : '#333', background: location.pathname.includes('progress') ? '#006791' : '#fff'}}>Progreso</p>
                        </Link>
                        <Link to='/customer-success/filtrar-fundae' className='buttonDropDown'>
                            <p style={{color: location.pathname.includes('filtrar-fundae') ? '#fff' : '#333', background: location.pathname.includes('filtrar-fundae') ? '#006791' : '#fff'}}>Filtrar Fundae</p>
                        </Link>
                    </>
                );
                break;
            case 'hubspot':
                if (alt2 === 'usuarios') {
                    setContent(
                        <>
                            <Link to='/hubspot/usuarios/actualizar-contactos' className='buttonDropDown'>
                                <p style={{color: location.pathname.includes('actualizarContacto') ? '#fff' : '#333', background: location.pathname.includes('actualizarContacto') ? '#006791' : '#fff'}}>Actualizar Contactos</p>
                            </Link>
                            <Link to='/hubspot/usuarios/crearContacto' className='buttonDropDown'>
                                <p style={{color: location.pathname.includes('crearContacto') ? '#fff' : '#333', background: location.pathname.includes('crearContacto') ? '#006791' : '#fff'}}>Crear Contacto</p>
                            </Link>
                        </>
                    );
                } else {
                    setContent(
                        <>
                            <Link to='/hubspot/conversaciones' className='buttonDropDown'>
                                <p style={{color: location.pathname.includes('conversaciones') ? '#fff' : '#333', background: location.pathname.includes('conversaciones') ? '#006791' : '#fff'}}>Conversaciones Wasapi</p>
                            </Link>
                            <Link to='/hubspot/usuarios' className='buttonDropDown'>
                                <p style={{color: location.pathname.includes('usuarios') ? '#fff' : '#333', background: location.pathname.includes('usuarios') ? '#006791' : '#fff'}}>Usuarios</p>
                            </Link>
                                                    </>
                );
                }
                break;
            case 'Guia':
                setContent(<p>Guia</p>);
                break;
            default:
                setContent(null);
        }
    }, [alt, location]);

    if (!content) {
        return null;
    }

    /*<Link to='/customer-success/companias' className='buttonDropDown'>
        <p style={{color: location.pathname.includes('companias') ? '#fff' : '#333', background: location.pathname.includes('companias') ? '#006791' : '#fff'}}>Compañias</p>
    </Link>
    <Link to='/hubspot/facturas' className='buttonDropDown'>
        <p style={{color: location.pathname.includes('facturas') ? '#fff' : '#333', background: location.pathname.includes('facturas') ? '#006791' : '#fff'}}>Facturas</p>
    </Link> */

    return (
        <div className='dropDown'>
            {content}
        </div>
    );
}

export default DropDown;
