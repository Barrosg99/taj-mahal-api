const CardHistory = require('../models/CardHistory');
const User = require('../models/User');

CardHistory.belongsTo(User);
User.hasOne(CardHistory);
