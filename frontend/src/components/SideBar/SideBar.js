import React, { Component } from 'react';
import Logo from '../Logo/Logo';
import Profile from '../Profile/Profile';
import './SideBar.css';
import SessionList from '../SessionList/SessionList';
import Menu from '../Menu/Menu';
import NavButton from '../NavButton/NavButton';

class SideBar extends Component {    
    state = {
        menuOpened: false
    };
    menuToggle = () => {
        this.setState((state) => ({menuOpened: !state.menuOpened }));
    };
    render() {
        return (
            <div className="SideBar">
                <div className="SideHeader">
                    <Logo />
                    <NavButton menuToggle={this.menuToggle} menuOpened={this.state.menuOpened}/>
                </div>
                {this.state.menuOpened ? <Menu/> : <SessionList/>}
                {/* changeActiveSession={this.props.changeActiveSession}*/}
                {/* <Profile user={this.context.username}/> */}
            </div>
        );
    }
}

export default SideBar;