const Session = require("../../models/session");
const User = require("../../models/user");

const user = async userId => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      sessions: sessions.bind(this, user.sessions)
    };
  } catch (err) {
    throw err;
  }
};

const singleSession = async sessionId => {
  try {
    const session = await Session.findById(sessionId);
    if (session !== null) {
        return transformSession(session);
    } else {
        return 'No such session';
    }
  } catch (err) {
    throw err;
  }
};

const sessions = async sessionIds => {
  try {
    const sessions = await Session.find({ _id: { $in: sessionIds } });
    return sessions.map(session => {
      return transformSession(session);
    });
  } catch (err) {
    throw err;
  }
};

const transformSession = session => {
  return {
    ...session._doc,
    _id: session._id,
    user: user.bind(this, session._doc.user)
  };
};

module.exports = {
  transformSession: transformSession
};
