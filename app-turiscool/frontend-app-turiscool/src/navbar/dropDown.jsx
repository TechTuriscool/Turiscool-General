import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./dropDown.css";

const DropDown = ({ alt }) => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        switch (alt) {
            case 'Educacion':
                setContent(
                    <Link to='/educacion/average' className='buttonDropDown'>
                        <p style={{color: location.pathname.includes('average') ? '#fff' : '#333', background: location.pathname.includes('average') ? '#006791' : '#fff'}}>Notas Medias</p>
                    </Link>
                );
                break;
            case 'CustomerSuccess':
                setContent(
                    <>
                        <Link to='/customer-success/firmafy' className='buttonDropDown'>
                            <p style={{color: location.pathname.includes('firmafy') ? '#fff' : '#333', background: location.pathname.includes('firmafy') ? '#006791' : '#fff'}}>Diplomas</p>
                        </Link>
                        <Link to='/customer-success/unsuspend' className='buttonDropDown'>
                            <p style={{color: location.pathname.includes('unsuspend') ? '#fff' : '#333', background: location.pathname.includes('unsuspend') ? '#006791' : '#fff'}}>Dar Alta</p>
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
    }, [alt]);

    return (
        <div className='dropDown'>
            {content}
        </div>
    );
}

export default DropDown;
