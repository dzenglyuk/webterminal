import React from 'react';

export default React.createContext({
    token: null,
    userId: null,
    username: null,
    email: null,
    access: null,
    admin: null,
    login: (token, userId, username, tokenExpiration, email, access, admin) => {
        console.error("auth-context: login is not defined")
    },
    logout: () => {
        console.error("auth-context: logout is not defined")
    }
});