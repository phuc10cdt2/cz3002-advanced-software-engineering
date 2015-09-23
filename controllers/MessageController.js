var Message = require('../models/message');
var ResponseHelper = require('./ResponseHelper');
exports.send = function(req, res) {
    var body = req.body;
    var user = req.user;
    var sender = user.username;
    var sendername = user.displayname;
    var receiver = body.receiver;
    var content = body.message;
    var message = new Message({
        content: content,
        sender: sender,
        sendername: sendername,
        receiver: receiver
    });
    message.save(function(err){
        if(err){
            res.sendStatus(500);
            console.log(err);
        }
        else{
            res.sendStatus(200);
        }
    });
};

exports.retrieve = function(req, res) {
    var body = req.body;
    var user = req.user;
    Message.find({$and:[{receiver: user.username},{seen: false}]}, function(err, msg){
        if(err){
            res.sendStatus(500);
        }else{
            res.send(msg);
        }
    });
};

exports.read = function(req, res) {
    var body = req.body;
    var msgid = body.msgid;
    Message.findById(msgid, function(err, msg){
        if(err){
            res.sendStatus(500);
            return;
        }   
        msg.seen = true;
        msg.save();
    });
}