const sgMail = require('@sendgrid/mail');

const { AlreadyHaveCardError, DoesNotHaveCardError } = require('../errors');
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

  findUserByPhone(phone) {
    return User.findOne({ where: { phone } });
  }

  createSession(userId) {
    return redis.setSession(userId);
  }

  deleteSession(key) {
    return redis.deleteSession(key);
  }

  userHasCard() {
    return User.findOne({ where: { hasCard: true } });
  }

  async userTakeCard(id) {
    const user = await User.findByPk(id);
    if (user.hasCard === true) throw new AlreadyHaveCardError('This user already have the card');

    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL,
      subject: `${user.nickname} pegou o cartão`,
      content: [
        {
          type: 'text/html',
          value: '<p>Hello from Twilio SendGrid!</p><p>Sending with the email service trusted by developers and marketers for <strong>time-savings</strong>, <strong>scalability</strong>, and <strong>delivery expertise</strong>.</p><p>%open-track%</p>',
        },
      ],
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);

    user.hasCard = true;
    await user.save();
  }

  async userReturnCard(id) {
    const user = await User.findByPk(id);
    if (user.hasCard === false) throw new DoesNotHaveCardError('This user does not have the card');

    user.hasCard = false;
    await user.save();
  }
}

module.exports = new UserController();
