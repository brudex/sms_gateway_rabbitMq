var express = require('express');
var router = express.Router();
const smsMessageController = require("../app/controllers/smsmessage_controller");

/*****Api routes*********************/
router.post('/sendSms', (req,res)=>{
  smsMessageController.sendSms(req.body);
  res.json({status:"00",message :"Queued"})
});
module.exports = router;
