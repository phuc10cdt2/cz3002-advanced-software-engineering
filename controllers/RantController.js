var Rant = require('../models/rant');

exports.create = function(req, res, next){
	var user = req.user;
	var body = req.body;
	var owner = user.username;
	var ownername = user.displayname;
	//these values not set over yet
	var viewtime;
	var lifetime;
	if(body.lifetime){
		lifetime = parseInt(body.lifetime,10);
	}
	else{
		lifetime = 3600;
	}
	if(body.viewtime){
		viewtime = parseInt(body.viewtime,10);
	}
	else{
		viewtime = 60;
	}
	if(body.anonymous){
		ownername = "Anonymous";
	}
	var rant = new Rant({
		owner: owner,
		content: body.content,
		ownername: ownername,
		lifetime:lifetime,
		viewtime:viewtime
	});
	rant.save(function(err, rant, num){
		if(err){
			console.log("FAILED to stored new rant");
			console.log(err);
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
	Rant.find({}).sort({created_at: -1}).exec(function(err, rants, num){
		if(err){
			res.send("FAILED to retrieve rants");
		}
		else{
			res.send(rants);
		}
	});
}