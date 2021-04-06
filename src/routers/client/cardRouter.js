const router = require('express').Router();

const cardController = require('../../controllers/cardController');
const { InvalidDataError } = require('../../errors');
const authMiddleware = require('../../middlewares/authMiddleware');
const cardSchema = require('../../schemas/cardSchema');

router
  .post('/histories', authMiddleware, async (req, res) => {
    const { error } = cardSchema.create.validate(req.body);
    if (error) throw new InvalidDataError(error.details[0].message);

    res.status(201).send(await cardController.createHistory(req.body, req.userId));
  })
  .get('/histories', authMiddleware, async (req, res) => {
    const { error } = cardSchema.querryString.validate(req.query);
    if (error) throw new InvalidDataError(error.details[0].message);

    res.send(await cardController.getHistory(req.query));
  });

module.exports = router;
