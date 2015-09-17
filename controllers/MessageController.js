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

}