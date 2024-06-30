// models/finance.js
const mongoose = require('mongoose');

const FinanceSchema = new mongoose.Schema({
  total_amount: { type: Number, default: 0 }
});

const FinanceModel = mongoose.model('finance', FinanceSchema);

module.exports = FinanceModel;
