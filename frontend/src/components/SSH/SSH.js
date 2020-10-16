import React, { Component } from 'react';
import { Terminal } from "xterm";
import { FitAddon } from "xterm-addon-fit";
import { AttachAddon } from "xterm-addon-attach";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { openSession, closeSession } from "../../redux";
import "xterm/css/xterm.css";
import './SSH.css';

class SSH extends Component {
    async componentDidMount() {
        const protocol = window.location.protocol === "https:" ? "wss://" : "ws://";
        let socketURL =
            protocol +
            window.location.hostname +
            // (window.location.port ? ":" + 8000 : "") +
            ":8000" +
            "/ssh/";

        const term = new Terminal({ cursorBlink: true });
        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(this.termElm);
        fitAddon.fit();
        let sshId = this.props.openedSSH.find((el) => {
            if (el.id === this.props.session._id) {
                return el;
            }
        });

        if (!sshId) {
            const res = await fetch(
                "https://webterminal:8000/ssh",
                { method: "POST" }
            );
            sshId = await res.text();
            this.props.openSession(this.props.session._id, sshId);
        } else {
            sshId = sshId.sshId;
        }

        socketURL += sshId;

        const socket = new WebSocket(socketURL);

        socket.onopen = () => {
            const attachAddon = new AttachAddon(socket);
            term.loadAddon(attachAddon);
            term._initialized = true;
        };
        this.term = term;
    }
    // componentWillUnmount() {
    //     this.props.closeSession(this.props.session._id);
    // }
    render() {
        return (
            <div className="Terminal">
                <div ref={(ref) => (this.termElm = ref)}></div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    openedSSH: state.openedSSH
});

const matchDispatchToProps = { openSession, closeSession };

export default connect(mapStateToProps, matchDispatchToProps)(SSH);
