import React, { Component } from "react";
import AuthContext from "../context/auth-context";
import "./NewSession.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setSessions } from "../redux";

class NewSession extends Component {
  state = {
    action: "create",
  };
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.name = React.createRef();
    this.address = React.createRef();
    this.protocol = React.createRef();
    this.port = React.createRef();
    this.user = React.createRef();
    this.password = React.createRef();
  }
  defaultPorts = {
    ssh: 22,
    telnet: 23,
    ftp: 21,
    rdp: 3389,
    vnc: 5900,
  };
  protocolChange = () => {
    this.port.current.value = this.defaultPorts[this.protocol.current.value];
  };
  cancelHandler = () => {};
  submitHandler = (e) => {
    e.preventDefault();
    const name = this.name.current.value;
    const address = this.address.current.value;
    const port = this.port.current.value;
    const suser = this.user.current.value;
    const password = this.password.current.value;
    const type = this.protocol.current.value;
    // console.log(name, address, type, port, suser, password);
    const token = this.context.token;

    if (this.state.action === "connect") {
      this.newConnection();
    } else if (this.state.action === "create") {
      let requestBody = {
        query: `
                    mutation {
                        createSession(sessionInput: {name: "${name}", address: "${address}", port: "${port}", suser: "${suser}", password: "${password}", type : "${type}"}) {
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
            throw new Error("Failed to create a session!");
          }
          return res.json();
        })
        .then((resData) => {
          const newSession = resData.data.createSession;
          this.props.setSessions([...this.props.sessions, newSession]);
          this.props.changeTab(0);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  render() {
    return (
      <div className="NewSession">
        <div className="session_container">
          <div className="session_title">
            <h1> New Session </h1>
          </div>
          <form onSubmit={this.submitHandler} autoComplete="off">
            <input type="hidden" value="something"/>
            <div className="session_inputs">
                <div className="top">
                  <div>
                    <label htmlFor="name">Name</label>
                    <br />
                    <input
                      name="name"
                      type="text"
                      placeholder="Server Name"
                      ref={this.name}
                      required
                    ></input>
                    <br />
                    <label htmlFor="address">Address</label>
                    <br />
                    <input
                      name="address"
                      type="text"
                      placeholder="Host Name or IP"
                      ref={this.address}
                      required
                    ></input>
                    <br />
                  </div>
                  <div className="bottom">
                    <label htmlFor="protocol">Protocol</label>
                    <br />
                    <select name="protocol" ref={this.protocol} defaultValue="ssh" onChange={this.protocolChange}>
                      <option value="ssh">SSH</option>
                      <option value="telnet">Telnet</option>
                      <option value="ftp">FTP</option>
                      <option value="rdp">RDP</option>
                      <option value="vnc">VNC</option>
                    </select>
                    <br />
                    <label htmlFor="port">Port</label>
                    <br />
                    <input
                      name="port"
                      type="number"
                      placeholder="Port"
                      ref={this.port}
                      defaultValue={22}
                    ></input>
                    <br />
                  </div>
                </div>
                <div>
                  <label htmlFor="user">Username</label>
                  <br />
                  <input
                    name="user"
                    type="text"
                    placeholder="Login Username"
                    ref={this.user}
                    autoComplete="email"
                  ></input>
                  <br />
                  <label htmlFor="password">Password</label>
                  <br />
                  <input
                    name="password"
                    type="password"
                    placeholder="Login Password"
                    ref={this.password}
                   autoComplete="new-password"
                  ></input>
                  <br />
                </div>
            </div>
            <div className="session_controls">
              <button className="cancel_btn" onClick={this.cancelHandler}>
                Cancel
              </button>
              <button className="create_btn" type="submit">
                {this.state.action === "create" ? "Create" : "Connect"}
              </button>
            </div>
          </form>    
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  sessions: state.sessions,
});

const matchDispatchToProps = (dispatch) => {
  return bindActionCreators({ setSessions: setSessions }, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(NewSession);
