// models/subscribe.js
const mongoose = require('mongoose');

const SubscribeSchema = new mongoose.Schema({
  email: { type: String, required: true },
  plan: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  expiryDate: { type: Date, required: true },
  amount: { type: Number, required: true }
});

const SubscribeModel = mongoose.model('subscriptions', SubscribeSchema);

module.exports = SubscribeModel;
