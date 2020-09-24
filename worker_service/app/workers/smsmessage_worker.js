#!/usr/bin/env node
const controller = require('../controllers/smsmessage_controller');
const config = require('../../config/config');
const amqp = require('amqplib/callback_api');
const Worker = {};
const queue = 'sms_messages';
const startupTime = Math.round(new Date().getTime() / 1000);

const stats = {
  workerQueue : queue,
  uptime: 0
  , messages: {
    total: 0
    , badMessages: 0
    , lastMsgSeen: startupTime
  }
};

function doWork(rawData){

  if(rawData) {
    try{
      let json = JSON.parse(rawData);
      controller.sendSms(json);
    }catch(e){
      console.log(`There was an error in queue ${queue}>> `,e);
      stats.messages.badMessages++;
    }
    stats.messages.total++;
    stats.messages.lastMsgSeen = Math.round(new Date().getTime() / 1000);
  }
}

Worker.execute = function(){
  amqp.connect(config.rabbitmq, function(error0, connection) {
    if (error0) {
      throw error0;
    }
    connection.createChannel(function(error1, channel) {
      if (error1) {
        throw error1;
      }
      channel.assertQueue(queue, {
        durable: false
      });
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);
      channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        doWork(msg.content.toString());
        const now = Math.round(new Date().getTime() / 1000);
        stats.uptime = now - startupTime;
      }, {
        noAck: true
      });
    });
  });
};

Worker.getStats = function(){
  return stats;
};

module.exports = Worker;
