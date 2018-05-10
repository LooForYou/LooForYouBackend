'use strict';
var moment = require('moment-timezone');

module.exports = function(Bathroom) {
	
	Bathroom.remoteMethod('formattedBathrooms', {
		http: {path: '/formatted-bathrooms', verb: 'get'},
		returns: {type: 'object', root: true}
	});

	Bathroom.remoteMethod('uploadImage', {
        accepts:[
            {arg: 'id', type: 'string', requried: true},
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}}
        ],
		http: {path: '/:id/upload-image', verb: 'post'},
		returns: {type: 'object', root: true}
    });
    
    Bathroom.uploadImage = function(id, req, res, cb){
        var Container = Bathroom.app.models.Container;
        var filter = {'id': id};
        Bathroom.exists(id, function(err, exists){
            if (error){
                var error = new Error();
                error.message = 'Bathroom not found!';
                error.statusCode = 404;
                cb(error);
            }else{
                if (exists){
                    Container.upload(req, res, {container: 'looforyou'}, function (containErr, result){
                        if (containErr){
                            var error = new Error();
                            error.message = 'Upload Failed';
                            error.statusCode = 404;
                            cb(error);
                        }else{
			    //console.log(result);
                            var url = 'http://ec2-54-183-105-234.us-west-1.compute.amazonaws.com:9000/api/Containers/looforyou/download/' + result.files["image"][0].providerResponse.name;
                        	Bathroom.updateAll(filter, {'image_url' : url}, function(bathroomErr, updateResult){
                                if (bathroomErr){
                                    var error = new Error();
                                    error.message = 'Recording URL Failed';
                                    error.statusCode = 404;
                                     cb(error);
                                }else{
                                     cb(null, result);     
                                }
                            });
                        }
                    });
                }else{
                    var error = new Error();
                    error.message = 'Bathroom not found';
                    error.statusCode = 404;
                    cb(error);
                }
            }
        });
    }
	
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
