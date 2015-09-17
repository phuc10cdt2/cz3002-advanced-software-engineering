var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    content: {type: String, required: true},
    sender: {type: String, required: true},
    sendername: {type: String, required: true},
    receiver: {type: String, required: true},
    seen: {type: Boolean, default: false},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
});

messageSchema.pre("save", function(next){
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at){
        this.created_at = now;
    }
    next();
});

var Message = mongoose.model("Message", messageSchema);
module.exports = Message;
