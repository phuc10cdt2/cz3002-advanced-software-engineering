var Rant = require('../models/rant');
var ResponseHelper = require('./ResponseHelper');
exports.create = function(req, res, next){
	var user = req.user;
	var body = req.body;
	var owner = user.username;
	var ownername = user.displayname;
	//these values not set over yet
	var viewtime;
	console.log(body);
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
	if(typeof(body.content) == 'undefined' || body.content == ''){
		res.status(400).send("Rant should not be empty");
		return;
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
			res.status(400).send("Rant posting failed!")
		}
		else{
			console.log("SUCCESS!");
			res.redirect('/');
		}
	});
}

exports.get = function(req, res, next){
	var user = req.user;
	var friendlist = user.friends;
	Rant.find({active:true}).sort({created_at: -1}).exec(function(err, rants, num){
		if(err){
			res.send("FAILED to retrieve rants");
		}
		else{
			var returnedRants =[];
			for(var i = 0; i<rants.length; i++){
				var rant = rants[i];
				if(friendlist.indexOf(rant.owner)>-1 || rant.owner == user.username){
					var date = new Date(rant.created_at);
					var created = date.valueOf();
					var now = new Date().getTime();
					var diff = (now - created)/1000;
					var whoviewed = rant.whoviewed;
					console.log("Diff time: " + diff);
					if(diff<rant.lifetime){
						if(whoviewed.indexOf(user.username) == -1)
							returnedRants.push(rant);
					}
					else{
						rant.active = false;
						rant.save();
					}
				}
			}
			res.send(returnedRants);
		}
	});
}

exports.updateViewer = function (req, res){
	var user = req.user;
	var rantId = req.body.id;
	if(typeof rantId === 'undefined'){
		res.status(500).send("Rant id is not specify");
	}
	console.log("id = " + rantId);
	Rant.findById(rantId, function (err, rant) {
		if(err){
			res.status(500).send("Server error");
		}
		var viewers = rant.whoviewed;
		if(viewers.indexOf(user.username) > -1){
			console.log("This user alr viewd this rant, why he can still view it");
			res.send("Viewed");
		}else{
			rant.whoviewed.push(user.username);
		} 
		rant.save(function (err) {
			if(err){
				console.log("Failed to update viewer list");
				res.status(500).send("Failed to update viewers");
			}
			res.status(200).send("Update viewer");
		});
	})
}
exports.getMyRants = function (req, res){
	var user = req.user;
	var username = user.username;
	Rant.find({$and: [{active: true}, {owner: username}]}, function(err, rants){
		if(err){
			console.log('Error');
		}
		res.json(rants);
	});
}
exports.deleteRant = function (req, res) {
	var id = req.params.id;
	Rant.remove({_id: id}, function (err, data){
		if(err){
			res.status(500).send("Failed");
		}
		else if(data){
			console.log("Deleted " + data);
			res.status(200).send('removed!');
		}
	});
}
exports.update = function (req, res){
	var body = req.body;
	var id = req.params.id;
	if(!id){
		id = body._id; 
		if(!id){
			res.status(400).send("Rant id not found!");
			return;
		}
	}
	console.log(body);
	Rant.findById({_id: id}, function(err, rant) {
		if(err){
			res.status(500).send("Failed");
		}
		if(!rant){
			res.status(400).send("No such rant");
			return;
		}		
		rant.content = body.content;
		rant.save(function(err, data){
			if(err){
				res.status(500).send("FAILED");
			}
			res.status(200).send(data);
		});
	})
}