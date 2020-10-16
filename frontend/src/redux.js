import { createStore } from "redux";
import { createAction } from 'redux-actions';

const initialState = {
  terminalOpened: false,
  processId: null,
  activeTab: 0,
  activeMenuTab: "account",
  sessions: [],
  activeSessions: [],
  openedSSH: []
};

const TERMINAL_OPENED = "process/TERMINAL_OPENED";

export const openTerminal = createAction(TERMINAL_OPENED, process => process);

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

export const openSession = createAction("OPEN_SESSION", (id, sshId) => ({ id, sshId }));

const replaceElement = (arr, newData, dataId) => arr.map(item => item.id == dataId ? { ...item, ...newData } : item);

export const closeSession = (id) => {
  return {
    type: "CLOSE_SESSION",
    payload: id
  };
};

export const process = (state = initialState, action) => {
  switch (action.type) {
    case TERMINAL_OPENED:
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
        activeTab: state.activeSessions.length + 1
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
