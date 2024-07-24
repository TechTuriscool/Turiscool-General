import React from 'react';
import Navbar from '../navbar/navbar';
import SideBar from '../navbar/sidebar';

const Estruture = ({data}) => {

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
                {data}
            </div>
        </div>
    </div>
    );
}

export default Estruture;