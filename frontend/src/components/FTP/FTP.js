import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile, faFolderOpen } from '@fortawesome/free-solid-svg-icons';
import './FTP.css';

class FTP extends Component {
    state = {
        sessionId: null,
        path: null,
        list: []
    };
    async componentDidMount() {
        const data = this.props.session;
        const res = await fetch("/ftp",
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }
          );
        const { sessionId, list } = await res.json();
        this.setState({ sessionId: sessionId, list: list, path: '/' });
    }
    async handleClick(item, goBack) {
        const path = goBack ? item.name : this.state.path.substr(1) + item.name;
        const data = {type: item.type, path: path};
        const res = await fetch("/ftp/" + this.state.sessionId,
            {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }
        );
        if (item.type === 'd') {
            const { list } = await res.json();
            const path = item.name === '/' ? item.name : item.name + '/';
            this.setState((state) => ({ list: list, path: state.path + path }));
        } else {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${item.name}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        }
    }
    goBack() {
        const pathArr = this.state.path.split('/');
        const path = pathArr.slice(0, pathArr.length-2).join('/');
        this.handleClick({type: "d", name: path}, true);
        this.setState({path: ''});
    }
    render() {
        const list = this.state.list.map(item => {
            let date = item.date.substr(0, 10) + ', ' + item.date.substr(11, 8);
            return (
                <tr className="ftp_item" key={item.name} onClick={this.handleClick.bind(this, item, false)}>
                    <td> <FontAwesomeIcon icon={item.type === 'd' ? faFolderOpen : faFile} size="lg"/> </td>
                    <td> {item.name} </td>
                    <td> {item.type === 'd' ? '' : item.size + " B"} </td>
                    <td> {date} </td>
                </tr>  
            );
        });
        return (
            <div className="FTP">
                <div className="ftp_header">
                    <h2> Index {this.state.path} </h2>
                </div>
                <div className="ftp_list">
                    {this.state.path !== "/" && (
                        <button className="ftp_back_btn" onClick={this.goBack.bind(this)}> Back </button>
                    )}
                    <table>
                        <thead>
                            <tr>
                                <th></th>
                                <th> Name </th>
                                <th> Size </th>
                                <th> Date </th>
                            </tr>
                        </thead>
                        <tbody>
                            {list}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default FTP;