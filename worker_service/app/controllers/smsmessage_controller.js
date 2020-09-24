const mongoose = require('mongoose');
const _ = require('lodash');
const SmsMessage = mongoose.model('SmsMessage');
const utils = require('../utils');

const SmsMessageController = {};
module.exports = SmsMessageController;


SmsMessageController.sendSms = (smsMessage) => {
  let mobile = utils.formatMobile(smsMessage.mobile);
  if(_.isEmpty(smsMessage.appId)){
    smsMessage.appId = 'DefaultApp'
  }

  /*
  TODO : Implementation for calling vendor api to send sms
   */
  let sms = new SmsMessage({mobile:mobile,message:smsMessage.message,appId:smsMessage.appId});
  sms.save();
};



