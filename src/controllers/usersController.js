const User = require('../models/User');

class UserController {
  async createUser(user) {
    const userCreated = await User.create(user);

    delete userCreated.dataValues.password;

    return userCreated;
  }

  findUserByEmail(email) {
    return User.findOne({ where: { email } });
  }
}

module.exports = new UserController();
