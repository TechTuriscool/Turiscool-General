import React from 'react';
import { Navigate } from 'react-router-dom';

const PasswordIsTrue = ({ element: Component}) => {
    const isPasswordCorrect = localStorage.getItem("passwordIsCorrect") === 'true';

    if (isPasswordCorrect) {
        return <Component/>;
    } else {
        return <Navigate to="/" />;
    }
};

export default PasswordIsTrue;
