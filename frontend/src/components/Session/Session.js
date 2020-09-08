import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/auth-context";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSessions, activateSession, setTab } from "../../redux";
import "./Session.css";

class Session extends Component {
  state = {
    session: this.props.session,
  };
  static contextType = AuthContext;
  clickHandler = () => {
    const session = this.state.session;
    if (!this.props.edit) {
      if (!this.props.activeSessions.includes(session)) {
        this.props.activateSession(session);   
      } else {
        let index = this.props.activeSessions.indexOf(session);
        this.props.setTab(index+1);
      }
    }
  }
  deleteSession = () => {
    const requestBody = {
      query: `
          mutation {
            deleteSession(sessionId: "${this.state.session._id}", user: "${this.context.userId}") {
                _id
                name
                address
                port
                suser
                type
            }
          }
              `,
    };
    const token = this.context.token;

    fetch("https://webterminal:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const sessions = resData.data.deleteSession;
        this.props.setSessions(sessions);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    const session = this.state.session;
    const types = [
      { type: "ssh", text: "SSH" },
      { type: "telnet", text: "Telnet" },
      { type: "rdp", text: "RDP" },
      { type: "vnc", text: "VNC" },
      { type: "ftp", text: "FTP" },
    ];
    const type = types.filter((t) => t.type === session.type)[0];
    return (
      <tr
        className="Session"
        // onClick={this.props.changeActiveSession.bind(this, session)}
        onClick={this.clickHandler}
      >
        <td>
          <div className={"type_badge " + type.type + "_color"}>
            {" "}
            {type.text}{" "}
          </div>
        </td>
        <td>
          <p className="session_name">
            {" "}
            {session.name ? session.name : "Session Name"}{" "}
          </p>
          <p>
            {" "}
            {session.address} {session.suser ? `(${session.suser})` : ""}{" "}
          </p>
        </td>
        <td className="delete_icon">
          {this.props.edit && (
              <FontAwesomeIcon icon={faTrashAlt} onClick={this.deleteSession} />
          )}
        </td>
      </tr>
    );
  }
}
const mapStateToProps = (state) => ({
  sessions: state.sessions,
  activeSessions: state.activeSessions
});

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ setSessions: setSessions, activateSession: activateSession, setTab: setTab }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(Session);
