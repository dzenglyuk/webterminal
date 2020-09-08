import React, { Component } from 'react';
import { connect } from "react-redux";
import Account from "../components/Account/Account";
import Admin from "../components/Admin/Admin";
import Contact from "../components/Contact/Contact";
import './Settings.css';

class Settings extends Component {
    render() {
        const titles = {account: "Account", admin: "Administration", contact: "Contact us"};
        const active = this.props.activeMenuTab;
        return (
            <div className="Settings">
                <div className="settings_title">
                    <h2> {titles[active]} </h2>
                </div>
                {active === "account" && (
                    <Account />
                )}
                {active === "admin" && (
                    <Admin />
                )}
                {active === "contact" && (
                    <Contact />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    activeMenuTab: state.activeMenuTab
});
  
export default connect(mapStateToProps)(Settings);