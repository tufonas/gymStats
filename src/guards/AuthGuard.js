import React from 'react';
import {Navigate} from "react-router-dom";

export const ProtectedRoute = ({ component: Component, user,  ...props }) => {
    if (!user) {
        console.log(user)
        return <Navigate to="/login" replace />;
    }
    return <Component user={user} {...props} />;
};

