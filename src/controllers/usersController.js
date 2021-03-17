const User = require('../models/User');
const redis = require('../utils/redis');

class UserController {
  async createUser(user) {
    const userCreated = await User.create(user);

    delete userCreated.dataValues.password;
    delete userCreated.dataValues.createdAt;
    delete userCreated.dataValues.updatedAt;

    return userCreated;
  }

  findUserByEmail(email) {
    return User.findOne({ where: { email } });
  }

  createSession(userId) {
    return redis.setSession(userId);
  }
}

module.exports = new UserController();
