// Example model

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SmsMessageSchema = new Schema({
  mobile: String,
  sender: String,
  message: String,
  appId: String,
  reference: String,
  createdAt: { type: Date, default: Date.now }
});

SmsMessageSchema.virtual('date')
  .get(() => this._id.getTimestamp());

mongoose.model('SmsMessage', SmsMessageSchema);

