const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');

const { AlreadyHaveCardError, DoesNotHaveCardError } = require('../errors');
const User = require('../models/User');
const redis = require('../utils/redis');

class UserController {
  async verifyUser(user) {
    const token = jwt.sign(user, process.env.SECRET);

    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL,
      subject: `${user.nickname} deseja se cadastrar`,
      content: [
        {
          type: 'text/html',
          value: `
          <br><br>
          <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
            <a href=${process.env.URL_API}users/${process.env.REGISTER_USER_ROUTE}?token=${token} style="margin: 0 auto;">
              <button style="background: #46A7D4; width: 150px; height: 40px; font-size: 16px; cursor: pointer; color: white; border-radius: 10px; border: none;">
                Cadastrar Usuário
              </button>
            </a>
          </div>`,
        },
      ],
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);
  }

  async createUser(user) {
    await User.create(user);

    const msg = {
      to: user.email,
      from: process.env.ADMIN_EMAIL,
      subject: 'Você já pode se logar',
      content: [
        {
          type: 'text/html',
          value: `
          <br><br>
          <div style="width: 100%; display: flex; justify-content: center; align-items: center;">
            <a href=https://www.reptajmahal.tk/ style="margin: 0 auto;">
              <button style="background: #46A7D4; width: 150px; height: 40px; font-size: 16px; cursor: pointer; color: white; border-radius: 10px; border: none;">
                Ir para Login
              </button>
            </a>
          </div>`,
        },
      ],
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);
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
          value: '<h1>Meu pau no seu botão</h1>',
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

    const msg = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.ADMIN_EMAIL,
      subject: `${user.nickname} devolveu o cartão`,
      content: [
        {
          type: 'text/html',
          value: '<h1>Meu pau na sua mão</h1>',
        },
      ],
    };

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send(msg);

    user.hasCard = false;
    await user.save();
  }
}

module.exports = new UserController();
