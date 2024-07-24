import React from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';
import './guide.css';

const Guide = () => {
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
}

export default Guide;