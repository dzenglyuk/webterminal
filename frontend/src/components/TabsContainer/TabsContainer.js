import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import "react-tabs/style/react-tabs.css";
import "./TabsContainer.css";
import XTerminal from "../Terminal/Terminal";
import NewSession from "../../pages/NewSession";
import FTP from "../FTP/FTP";
import SSH from "../SSH/SSH";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { deactivateSession, setTab } from "../../redux";

class TabsContainer extends Component {
  render() {
    const tabs = this.props.activeSessions.map(session => (
      <Tab key={session._id}>
        {session.name}
        <FontAwesomeIcon icon={faTimes} className="tabCloseBtn" onClick={this.props.deactivateSession.bind(this, session._id)}/>
      </Tab>
    ));
    const tabPanels = this.props.activeSessions.map(session => (
      <TabPanel key={session._id}>
         {/* {session.address} */}
         {session.type === "ftp" && (
           <FTP session={session}/>
         )}
         {session.type === "ssh" && (
           <SSH session={session}/>
         )}
      </TabPanel>
    ));
    return (
      <Tabs className="TabsContainer" selectedIndex={this.props.activeTab} onSelect={tabIndex => this.props.setTab(tabIndex)}>
        <TabList>
          <Tab>
            <FontAwesomeIcon icon={faHome} />
          </Tab>
          {tabs}
          <Tab>
            <FontAwesomeIcon icon={faPlus} />
          </Tab>
        </TabList>

        <TabPanel>
          <XTerminal />
        </TabPanel>
        {tabPanels}
        <TabPanel>
          <div className="NewTab">
            <NewSession changeTab={this.props.setTab}/>
          </div>
        </TabPanel>
      </Tabs>
    );
  }
}

const mapStateToProps = (state) => ({
  activeSessions: state.activeSessions,
  activeTab: state.activeTab
});

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ deactivateSession: deactivateSession, setTab: setTab }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(TabsContainer);