import React from 'react';

import './Backdrop.css';

const BackDrop = ({ handleClick }) => (
    <div className="Backdrop" onClick={handleClick}/>
);

export default BackDrop;