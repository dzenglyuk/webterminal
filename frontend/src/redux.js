import { createStore } from "redux";

const initialState = {
  terminalOpened: false,
  processId: null,
  activeTab: 0,
  activeMenuTab: "account",
  sessions: [],
  activeSessions: [],
  openedSSH: []
};

export const openTerminal = (process) => {
  return {
    type: "TERMINAL_OPENED",
    payload: process,
  };
};

export const setSessions = (sessions) => {
  return {
    type: "SET_SESSIONS",
    payload: sessions,
  };
};

export const activateSession = (session) => {
  return {
    type: "ACTIVATE_SESSION",
    payload: session,
  };
};

export const deactivateSession = (session) => {
  return {
    type: "DEACTIVATE_SESSION",
    payload: session,
  };
};

export const setTab = (tab) => {
  return {
    type: "SET_ACTIVE_TAB",
    payload: tab,
  };
};

export const changeMenuTab = (tab) => {
  return {
    type: "CHANGE_MENU_TAB",
    payload: tab
  };
};

export const openSession = (id, sshId) => {
  return {
    type: "OPEN_SESSION",
    payload: { id: id, sshId: sshId }
  };
};

export const closeSession = (id) => {
  return {
    type: "CLOSE_SESSION",
    payload: id
  };
};

export const process = (state = initialState, action) => {
  switch (action.type) {
    case "TERMINAL_OPENED":
      return {
        ...state,
        terminalOpened: true,
        processId: action.payload
      };
    case "SET_SESSIONS":
      return {
        ...state,
        sessions: action.payload,
      };
    case "ACTIVATE_SESSION":
      return {
        ...state,
        activeSessions: [...state.activeSessions, action.payload],
        activeTab: state.activeSessions.length+1
      };
    case "DEACTIVATE_SESSION":
      return {
        ...state,
        activeSessions: state.activeSessions.filter(session => session._id !== action.payload)
      };
    case "SET_ACTIVE_TAB":
      return {
        ...state,
        activeTab: action.payload
      };
    case "CHANGE_MENU_TAB":
      return {
        ...state,
        activeMenuTab: action.payload
      };
    case "OPEN_SESSION":
      return {
        ...state,
        openedSSH: [...state.openedSSH, action.payload]
      };
    case "CLOSE_SESSION":
      return {
        ...state,
        openedSSH: state.openedSSH.filter(session => session._id !== action.payload)
      };  
    default:
      return state;
  }
};

export const store = createStore(process);
