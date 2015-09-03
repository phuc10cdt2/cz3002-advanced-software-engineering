var Rant = require('../models/rant');

exports.create = function(req, res, next){
	var user = req.user;
	var body = req.body;
	var owner = user.username;
	var ownername = user.displayname;
	//these values not set over yet
	var lifetime = body.lifetime;
	var viewtime = body.viewtime;
	if(body.anonymous){
		ownername = "Anonymous";
	}
	var rant = new Rant({
		owner: owner,
		content: body.content,
		ownername: ownername
	});
	rant.save(function(err, rant, num){
		if(err){
			console.log("FAILED to stored new rant");
			res.send("FAILED!");
		}
		else{
			console.log("SUCCESS!");
			res.redirect('/');
		}
	});
}

exports.get = function(req, res, next){
	var user = req.user;
	Rant.find({}, function(err, rants, num){
		if(err){
			res.send("FAILED to retrieve rants");
		}
		else{
			res.send(rants);
		}
	});
}