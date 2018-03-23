'use strict';
var moment = require('moment-timezone');

module.exports = function(Bathroom) {
	
	Bathroom.remoteMethod('formattedBathrooms', {
		http: {path: '/formatted-bathrooms', verb: 'get'},
		returns: {type: 'object', root: true}
	});
	
	Bathroom.formattedBathrooms = function(callback){
		Bathroom.find({}, function(err, res){
			if (err){
				console.log(err);
				callback(err);
			}else{
				if (res){
					var result = [];
					for (var i in res){
						var start_time = moment.tz(res[i].start_time, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
						var end_time = moment.tz(res[i].end_time, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
						var maintenance_start = moment.tz(res[i].maintenance_start, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
						var maintenance_end = moment.tz(res[i].maintenance_end, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
					
						result.push({
							"name": res[i].name,
							"id" : res[i].id,
							"rating" : res[i].rating,
							"clean_rating" : res[i].clean_rating,
							"latitude" : res[i].latitude,
							"longitude" : res[i].longitude,
							"address" : res[i].address,
							"start_time" : start_time,
							"end_time" : end_time,
							"maintenance_start" : maintenance_start,
							"maintenance_end" : maintenance_end,
							"maintenance_days" : res[i].maintenance_days,
							"bookedmarked" : res[i].bookedmarked,
							"amenities" : res[i].amenities,
							"descriptions" : res[i].description,
							"image_url" : res[i].image_url
						});
					}
					callback(null, result);
				}else{
					var error = new Error();
					error.message = 'Bathrooms not found.';
					error.statusCode = 404;
					callback(error);
				}
			}
		});
	}
	
	//Bathroom.afterRemote('find', function(context, unused, next){
		//for(var i in context.result) {
			//var start_time = moment.tz(context.result[i].start_time, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
			//context.result[i].start_time = start_time;
			//console.log(context.result[i].start_time);
		//}
		//next();
	//});
};
