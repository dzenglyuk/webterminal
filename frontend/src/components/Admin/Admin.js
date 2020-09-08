import React, { Component } from "react";
import "./Admin.css";

class Admin extends Component {
    state = {
        data: false,
        message: 'Loading...',
        users: []

    }

    componentDidMount() {
        this.fetchUsers();
    }

    fetchUsers = () => {
        const requestBody = {
            query: `
                        query {
                            users {
                                username
                                email
                                access
                                admin                 
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
              const users = resData.data.users;
              this.setState({users: users, data: true});
            })
            .catch((err) => {
              console.log(err);
            });
    }

    changeHandler(obj, event) {
        this.toggleHandler(event.target);
        const conf = obj.value === "access" ? `access: ${!obj.user.access}, admin: ${obj.user.admin}` : 
        `access: ${obj.user.access}, admin: ${!obj.user.admin}`;
        const requestBody = {
            query: `
            mutation {
                editUser(email: "${obj.user.email}", ${conf}) {
                  email
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
            .catch((err) => {
              console.log(err);
            });
    }

    toggleHandler(target) {
        if (target.classList.contains("checked")) {
            target.classList.remove("checked");
        } else {
            target.classList.add("checked");
        }
    }

    render() {
        const usersList = this.state.users.map(user => {
            const access = user.access ? "checked" : null;
            const admin = user.admin ? "checked" : null;
            return (
             <tr key={user.email}>
                <td> {user.username} </td>
                <td> {user.email} </td>
                <td>
                    <label className="switch">
                        <input type="checkbox" className={access} onChange={this.changeHandler.bind(this, {user: user, value: "access"})}/>
                        <span className="slider"></span>
                    </label>
                </td>
                <td>
                    <label className="switch">
                        <input type="checkbox" className={admin} onChange={this.changeHandler.bind(this, { user: user, value: "admin"})}/>
                        <span className="slider"></span>
                    </label>
                </td>
                <td> <button className="remove-btn"> Remove </button> </td>
            </tr>);
        });
        return (
            <div className="Admin">
                {!this.state.data && (
                    <div> {this.state.message} </div>
                )}
                {this.state.data && (
                    <table>
                        <tbody>
                            <tr>
                                <th> Username </th>
                                <th> Email </th>
                                <th> Access </th>
                                <th> Admin </th>
                                <th> Remove </th>
                            </tr>
                            {usersList}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }
};

export default Admin;