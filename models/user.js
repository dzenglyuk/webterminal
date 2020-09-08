const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  access: {
    type: Boolean,
    required: true
  },
  admin: {
    type: Boolean,
    required: true
  },
  sessions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Session'
    }
  ]
});

module.exports = mongoose.model('User', userSchema);