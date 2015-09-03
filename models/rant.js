var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var rantSchema = new Schema({
    content: {type: String, required: true},
    owner: {type: String, required: true},
    ownername: {type: String},
    public: {type: Boolean, default: false},
    lifetime: {type: Number, default: 3600},
    viewtime: {type: Number, default: 60},
    updated_at: {type: Date, default: Date.now},
    created_at: {type: Date, default: Date.now},
    active: {type: Boolean, default: true}
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
