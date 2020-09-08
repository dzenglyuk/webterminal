const Session = require("../../models/session");
const User = require("../../models/user");
const { transformSession } = require("./merge");

module.exports = {
  sessions: async args => {
    try {
      const sessions = await Session.find({user: args.user});
      return sessions.map(session => {
        return transformSession(session);
      });
    } catch (err) {
      throw err;
    }
  },
  createSession: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated');
    }
    const session = new Session({
      name: args.sessionInput.name,
      address: args.sessionInput.address,
      port: args.sessionInput.port,
      suser: args.sessionInput.suser,
      password: args.sessionInput.password,
      type: args.sessionInput.type,
      user: req.userId
    });
    let createdSession;
    try {
      const result = await session.save();
      createdSession = transformSession(result);
      const user = await User.findById(req.userId);
      if (!user) {
        throw new Error("No such user");
      }
      user.sessions.push(session);
      await user.save();

      return createdSession;
    } catch (err) {
      throw err;
    }
  },
  deleteSession: async (args, req) => {
    if (!req.isAuth) {
        throw new Error('Unauthenticated');
    }
    try {
      await Session.deleteOne({ _id: args.sessionId });
      const sessions = await Session.find({user: args.user});
      return sessions.map(session => {
        return transformSession(session);
      });
    } catch (err) {
      throw err;
    }
  }
};
