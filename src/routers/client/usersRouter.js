const router = require('express').Router();
const { hashSync, compareSync } = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersController = require('../../controllers/usersController');
const usersSchema = require('../../schemas/usersSchema');
const { InvalidDataError, ConflictError } = require('../../errors');
const AuthError = require('../../errors/AuthError');
const authMiddleware = require('../../middlewares/authMiddleware');

router
  .get(`/${process.env.REGISTER_USER_ROUTE}`, async (req, res) => {
    jwt.verify(req.query.token, process.env.SECRET, async (err, decoded) => {
      if (err) {
        res.status(404).send(`
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>Error</title>
          </head>
          <body>
            <pre>Cannot GET /users/${process.env.REGISTER_USER_ROUTE}</pre>
          </body>
        </html>
        `);
      }
      await usersController.createUser(decoded);
      res.send(`<h1>${decoded.nickname} foi criado</h1>`);
    });
  })
  .post('/sign-up', async (req, res) => {
    const { error } = usersSchema.signUp.validate(req.body);
    if (error) throw new InvalidDataError(error.details[0].message);

    if (await usersController.findUserByEmail(req.body.email)) throw new ConflictError('Email already in use');

    if (await usersController.findUserByPhone(req.body.phone)) throw new ConflictError('Number already registered');

    req.body.password = hashSync(req.body.password, 10);

    await usersController.verifyUser(req.body);
    res.sendStatus(200);
  })
  .post('/sign-in', async (req, res) => {
    const { error } = usersSchema.signIn.validate(req.body);
    if (error) throw new InvalidDataError(error.details[0].message);

    const user = await usersController.findUserByEmail(req.body.email);

    if (!user || !compareSync(req.body.password, user.password)) throw new AuthError('Email or password incorrect');

    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    user.dataValues.token = await usersController.createSession(user.id);

    res.status(201).send(user);
  })
  .post('/sign-out', authMiddleware, async (req, res) => {
    await usersController.deleteSession(req.sessionId);
    res.sendStatus(204);
  })
  .post('/card', authMiddleware, async (req, res) => {
    const user = await usersController.userHasCard();
    if (user) {
      res.status(200).send(user);
    } else {
      await usersController.userTakeCard(req.userId);
      res.sendStatus(202);
    }
  })
  .post('/card-release', authMiddleware, async (req, res) => {
    await usersController.userReturnCard(req.userId);
    res.sendStatus(204);
  });

module.exports = router;
