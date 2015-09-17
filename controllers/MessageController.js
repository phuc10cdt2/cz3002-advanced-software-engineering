var Message = require('../models/message');

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

exports.reply = function(req, res) {
    var body = req.body;
    var user = req.user;
    var msgid = body.msgid;
    var receiver = body.receiver;
    var message = body.message;
    Message.findById(msgid, function(err, msg){
        if(err){
            res.sendStatus(500);
            return;
        }   
        msg.seen = true;
        msg.save();
    });
    var newMsg = new Message({
        content: message,
        sender: user.username,
        sendername: user.displayname,
        receiver: receiver
    });
    newMsg.save(function(err) {
        if(err){
            res.sendStatus(500);
        }else{
            res.sendStatus(200);
        }
    });
}