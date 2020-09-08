import React from 'react';
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faHome } from '@fortawesome/free-solid-svg-icons';

import './NavButton.css';

function NavButton (props) {
    const history = useHistory();

    function handleClick(route) {
        props.menuToggle();
        history.push(route);
    }

    const button = props.menuOpened ?
            <FontAwesomeIcon icon={faHome} size="lg" onClick={handleClick.bind(this, "/home")}/>:
            <FontAwesomeIcon icon={faBars} size="lg" onClick={handleClick.bind(this, "/settings")}/>;

    return (
        <div className="NavButton">{button}</div>
        );
}

export default NavButton;
