import React, { useState } from 'react';
import './collapsibleSection.css';

const CollapsibleSection = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="collapsible-section">
            <div className="collapsible-header" onClick={toggleOpen}>
                <h1>{title}</h1>
                <span className={`arrow ${isOpen ? 'open' : 'closed'}`}></span>
            </div>
            {isOpen && <div className="collapsible-content">{children}</div>}
        </div>
    );
};

export default CollapsibleSection;
