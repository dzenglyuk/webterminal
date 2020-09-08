const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/user");

module.exports = {
  users: async args => {
    try {
      const users = await User.find();
      return users;
      // return users.map(user => {
      //   return transformSession(session);
      // });
    } catch (err) {
      throw err;
    }
  },
  createUser: async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error("User already exist");
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);
      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
        username: args.userInput.username,
        access: false,
        admin: false
      });
      const result = await user.save();
      return { ...result._doc, password: null };
    } catch (err) {
      throw err;
    }
  },
  login: async ({email, password}) => {
      try {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist!');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Password is incorrect!');
        }
        const token = jwt.sign({userId: user.id, email: user.email}, 'somesupersecretkey', {
            expiresIn: '1h'
        });
        if (!user.access) {
          throw new Error('Access Forbidden!');
        }
        return {userId: user.id, token: token, tokenExpiration: 1, username: user.username, email: user.email, access: user.access, admin: user.admin};
      } catch (err) {
        throw err;
      }
  },
  editUser: async ({email, access, admin}) => {
    try {
      const user = await User.findOneAndUpdate({ email: email }, {access: access, admin: admin});
        if (!user) {
            throw new Error('User does not exist!');
        }
      return user;  
    } catch (err) {
      throw err;
    }
  }
};
