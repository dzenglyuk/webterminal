import React, { Component } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import { Provider } from 'react-redux';

import { store } from './redux';
import AuthPage from "./pages/Auth";
import Settings from "./pages/Settings";
import Header from "./components/Header/Header";
import BackGround from "./components/BackGround/BackGround";
import SideBar from "./components/SideBar/SideBar";
import TabsContainer from "./components/TabsContainer/TabsContainer";
import AuthContext from "./context/auth-context";


import "./App.css";

class App extends Component {
  state = {
    token: null,
    userId: null,
    username: null,
    email: null,
    access: null,
    admin: null
    // activeSession: null,
  };

  login = (token, userId, username, tokenExpiration, email, access, admin) => {
    this.setState({ token: token, userId: userId, username: username, email: email, access: access, admin: admin });
  };

  logout = () => {
    this.setState({ token: null, userId: null, username: null, email: null });
  };

  // changeActiveSession = session => {
  //   this.setState({ activeSession: session});
  //   console.log(this.state.activeSession);
  // };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <Provider store={store}>
            <AuthContext.Provider
              value={{
                token: this.state.token,
                userId: this.state.userId,
                username: this.state.username,
                email: this.state.email,
                access: this.state.access,
                admin: this.state.admin,
                login: this.login,
                logout: this.logout
              }}
            >
              <div className={this.state.token && "App"}>
                {this.state.token ? <SideBar user={this.state.username} changeActiveSession={this.changeActiveSession} /> : <Header />}
                <main className="main-content">
                  <BackGround />
                  <Switch>
                    {!this.state.token && <Redirect from="/" to="/auth" exact />}
                    {this.state.token && <Redirect from="/auth" to="/home" exact />}
                    {!this.state.token && (
                      <Route path="/auth" component={AuthPage} />
                    )}
                    {this.state.token && (
                      <Route path="/home" component={TabsContainer} activeSession={this.state.activeSession} />
                    )}
                    {this.state.token && (
                      <Route path="/settings" component={Settings} />
                    )}
                    <Redirect from="*" to="/auth" />
                  </Switch>
                </main>
              </div>
            </AuthContext.Provider>
          </Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const WrappedRoute = (ComponentForWrap) => {
  return React.memo((props) => {
    const isAuth = getIsAuth();

    if (!isAuth) return <Redirect to="/auth" />;

    return <ComponentForWrap {...props} />
  })
}

export default App;
