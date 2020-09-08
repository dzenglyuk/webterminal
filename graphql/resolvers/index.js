const userResolver = require('./user');
const sessionResolver = require('./session');

const rootResolver = {
  ...userResolver,
  ...sessionResolver
};

module.exports = rootResolver;