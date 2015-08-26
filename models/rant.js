var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rantSchema = new Schema({
    title: {type: String, required: false},
    content: {type: String, required: true},
    owner: {type: String, required: true},
    anonymous: {type: Boolean, required: true},
    public: {type: Boolean, required: true},
    lifetime: {type: Number, default: 3600},
    viewtime: {type: Number, default: 60},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now}
});

rantSchema.pre("save", function(next){
    var now = new Date();
    this.updated_at = now;
    if(!this.created_at){
        this.created_at = now;
    }
    next();
});

var Rant = mongoose.model("Rant", rantSchema);
module.exports = Rant;
