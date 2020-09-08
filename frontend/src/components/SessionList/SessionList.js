import React, { Component } from "react";
import "./SessionList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPlusSquare } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import Session from "../Session/Session";
import AuthContext from "../../context/auth-context";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSessions, setTab } from "../../redux";

class SessionList extends Component {
  state = {
    edit: false,
  };
  static contextType = AuthContext;
  componentDidMount() {
    this.fetchSessions();
  }
  editHandler = () => {
    this.setState((state) => ({ edit: !state.edit }));
  };
  fetchSessions = () => {
    const requestBody = {
      query: `
                  query {
                      sessions(user: "${this.context.userId}") {
                          _id
                          name
                          address
                          port
                          suser
                          type
                          password                 
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
        const sessions = resData.data.sessions;
        this.props.setSessions(sessions);
        console.log(resData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div className="SessionList">
        <div className="session_header">
          <span> Sessions: </span>
          <span className="session_icons">
            <FontAwesomeIcon icon={faTrashAlt} onClick={this.editHandler} />
            <FontAwesomeIcon icon={faPlusSquare} onClick={() => {this.props.setTab(this.props.activeSessions.length+1)}}/>
          </span>
        </div>
        <table>
          <tbody>
            {this.props.sessions &&
              this.props.sessions.map((session) => {
                return (
                  <Session
                    session={session}
                    key={session._id}
                    edit={this.state.edit}
                    // changeActiveSession={this.props.changeActiveSession}
                  />
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  sessions: state.sessions,
  activeSessions: state.activeSessions
});

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ setSessions: setSessions, setTab: setTab }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(SessionList);
