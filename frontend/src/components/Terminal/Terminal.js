import React, { Component } from "react";
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import { connect } from "react-redux";
import { bindActionCreators } from 'redux';
import { openTerminal } from "../../redux";
import "xterm/css/xterm.css";
import "./Terminal.css";

class XTerminal extends Component {
  async componentDidMount() {
    const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
    let socketURL =
      protocol +
      window.location.hostname +
      // (window.location.port ? ":" + 8000 : "") +
      ":8000" +
      "/terminals/";

    const term = new Terminal({ cursorBlink: true });
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);
    term.open(this.termElm);
    fitAddon.fit();
    if (!this.props.terminalOpened) {
      const res = await fetch(
        "/terminals?cols=" + term.cols + "&rows=" + term.rows,
        { method: "POST" }
      );
      this.props.openTerminal(await res.text());
    }

    socketURL += this.props.processId;

    const socket = new WebSocket(socketURL);

    socket.onopen = () => {
      const attachAddon = new AttachAddon(socket);
      term.loadAddon(attachAddon);
      term._initialized = true;
    };
    this.term = term;
  }

  render() {
    return (
      <div className="Terminal">
          <div ref={(ref) => (this.termElm = ref)}></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  terminalOpened: state.terminalOpened,
  processId: state.processId,
});

const matchDispatchToProps = dispatch => {
    return bindActionCreators({openTerminal: openTerminal}, dispatch);
};

export default connect(mapStateToProps, matchDispatchToProps)(XTerminal);
