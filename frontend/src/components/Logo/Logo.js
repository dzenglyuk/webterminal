import React from 'react';

import './Logo.css';
import logo from "./logo.png";

const Logo = () => (
    <div className="Logo">
        <img src={logo} alt="Logo"></img>
        <h1> WebTerminal </h1>
    </div>
);

export default Logo;