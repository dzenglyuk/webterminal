import React, { Component } from "react";
import AuthContext from "../../context/auth-context";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeMenuTab } from "../../redux";
import "./Menu.css";

class Menu extends Component {
  static contextType = AuthContext;
  handleMenuChange = (tab) => {
    this.props.changeMenuTab(tab);
  };
  signOut = () => {
    this.handleMenuChange("account");
    this.context.logout();
  }
  render() {
    const active = this.props.activeMenuTab;
    const admin = this.context.admin;
    return (
      <div className="Menu">
        <div className="menu_header">
          <span> Menu: </span>
        </div>
        <ul>
          <li
            className={active === 'account' ? "menu_active" : ""}
            onClick={this.handleMenuChange.bind(this, "account")}
          > Account
          </li>
          {admin && (
            <li
            className={active === 'admin' ? "menu_active" : ""}
            onClick={this.handleMenuChange.bind(this, "admin")}
          > Administration </li>
          )}
          <li
            className={active === 'contact' ? "menu_active" : ""}
            onClick={this.handleMenuChange.bind(this, "contact")}
          > Contact us </li>
          <li onClick={this.signOut}> Sign Out </li>
        </ul>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
    activeMenuTab: state.activeMenuTab
});
  
const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({ changeMenuTab: changeMenuTab }, dispatch);
};
  
export default connect(mapStateToProps, matchDispatchToProps)(Menu);