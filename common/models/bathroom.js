'use strict';
var moment = require('moment-timezone');

module.exports = function(Bathroom) {
	
	/**
	 * Declaration to get method for formatting 
	 * bathrooms
	 */
	Bathroom.remoteMethod('formattedBathrooms', {
		http: {path: '/formatted-bathrooms', verb: 'get'},
		returns: {type: 'object', root: true}
	});

	/**
	 * Declaration to post method for uploading images
	 * of bathrooms. Endpoint path to url is /{Bathroom ID}/upload-image
	 */
	Bathroom.remoteMethod('uploadImage', {
        accepts:[
            {arg: 'id', type: 'string', requried: true},
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}}
        ],
		http: {path: '/:id/upload-image', verb: 'post'},
		returns: {type: 'object', root: true}
    });
	
	/**
	 * Implementation to post method for uploading images of bathrooms.
	 * 
	 * @param {ID of Bathroom in db} id 
	 * @param {Request with image data used by Container model} req 
	 * @param {Result of upload used by Container model} res 
	 * @param {callback function} cb 
	 */
    Bathroom.uploadImage = function(id, req, res, cb){
        var Container = Bathroom.app.models.Container;
		var filter = {'id': id};
		
		//Checks if the bathroom with give id exists
		//If it exists then exists returns true
		//otherwise exists is false
        Bathroom.exists(id, function(err, exists){
            if (error){
                var error = new Error();
                error.message = 'Bathroom not found!';
                error.statusCode = 404;
                cb(error);
            }else{
                if (exists){
					//Calls upload method from Container model to upload the image file to the s3 storage
                    Container.upload(req, res, {container: 'looforyou'}, function (containErr, result){
                        if (containErr){
                            var error = new Error();
                            error.message = 'Upload Failed';
                            error.statusCode = 404;
                            cb(error);
                        }else{
                            var url = 'http://ec2-54-183-105-234.us-west-1.compute.amazonaws.com:9000/api/Containers/looforyou/download/' + result.files["image"][0].providerResponse.name;
							//If it was a successful upload then update the Bathroom database with the link url to the image
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
	
	/**
	 * Format date data from the database to desired format for frontend
	 * 
	 * @param {callback function} callback 
	 */
	Bathroom.formattedBathrooms = function(callback){
		//Finds all bathrooms from database
		Bathroom.find({}, function(err, res){
			if (err){
				console.log(err);
				callback(err);
			}else{
				if (res){
					var result = [];
					for (var i in res){

						//Formatting all the dates
						var start_time = moment.tz(res[i].start_time, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
						var end_time = moment.tz(res[i].end_time, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
						var maintenance_start = moment.tz(res[i].maintenance_start, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
						var maintenance_end = moment.tz(res[i].maintenance_end, 'America/Los_Angeles').format('ddd MMM DD HH:mm:ss z YYYY');
					
						result.push({
							"name": res[i].name,
							"id" : res[i].id,
							"rating" : res[i].rating,
							"type" : res[i].type,
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
					//Return formatted result
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
};
