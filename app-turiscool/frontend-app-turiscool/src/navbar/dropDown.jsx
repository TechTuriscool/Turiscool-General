import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./dropDown.css";

const DropDown = () => {
    const [content, setContent] = useState(null);
    const alt = window.location.pathname.split('/')[1];
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
                    </>
                );
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

    return (
        <div className='dropDown'>
            {content}
        </div>
    );
}

export default DropDown;
