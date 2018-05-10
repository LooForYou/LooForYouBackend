'use strict';

module.exports = function(Review) {
	Review.remoteMethod('incrementLikes', {
        accepts:[
            {arg: 'id', type: 'string', required: true}
        ],
		http: {path: '/:id/increment-likes', verb: 'put'},
		returns: {type: 'boolean', root: true}
	});

	Review.remoteMethod('decrementLikes', {
		accepts:[
			{arg: 'id', type: 'string', required: true}
		],
		http: {path:'/:id/decrement-likes', verb: 'put'},
		returns: {type: 'boolean', root: true}
	});

	// Review.remoteMethod('deleteAll', {
	// 	http: {path: '/delete-all', verb: 'delete'},
	// 	returns: {type: 'boolean', root: true} 
	// });

	// Review.deleteAll = function(callback){

	// }
	
	Review.incrementLikes = function(id, callback){
		Review.findById(id, function(accountError, instance){
			if (accountError){
				var error = new Error();
                error.message = 'Account not found!';
                error.statusCode = 404;
                callback(error);
			}else{
				var incrementedLikes = instance.likes + 1;
				Review.updateAll({"id": id}, {"likes" : incrementedLikes }, function(updateError, info){
					if (updateError){
                		var error = new Error();
               			error.message = 'Update failed!';
                		error.statusCode = 404;
                		callback(updateError);
					}else{
						if (info.count >= 1)
							callback(null, true);
						else
							callback(null, false);
					}
				});
			}
		});
	}

	Review.decrementLikes = function(id, callback){
		Review.findById(id, function(accountError, instance){
			if (accountError){
				var error = new Error();
                error.message = 'Account not found!';
                error.statusCode = 404;
                callback(error);
			}else{
				var decrementLikes = instance.likes - 1;
				Review.updateAll({"id": id}, {"likes" : decrementLikes }, function(updateError, info){
					if (updateError){
                		var error = new Error();
               			error.message = 'Update failed!';
                		error.statusCode = 404;
                		callback(updateError);
					}else{
						if (info.count >= 1)
							callback(null, true);
						else
							callback(null, false);
					}
				});
			}
		});
	}


	Review.observe('before save', function(context, next){
		if (context.instance){
			if (context.isNewInstance){
				context.instance.time_created = new Date();
			}else{
				context.instance.time_updated = new Date();
			}
		}else{
			context.data.time_updated = new Date();
		}

		next();
	});

     Review.observe('after save', function(context, next){
		 if (context.instance)
		 	calculateRating(context.instance.bathroomId, next, null);
	 });

	 Review.observe('before delete', function(context, next){
		 if (context.where){
			Review.findById(context.where.id, function(err, result){

				calculateRating(result.bathroomId, next, result.id);
			});
	 	}
	 })

	 function calculateRating(id, next, deletedId){
		var Bathroom = Review.app.models.Bathroom;
		
		Review.find({where: {'bathroomId': id, 'id': {neq: deletedId}}}, function(reviewErr, models){
				if (reviewErr){
					var error = new Error();
					error.message = 'Couldnt find reviews for bathroom!';
					error.statusCode = 404;
					console.log(error.toString());
					next(error);
				}else{
					var sum = 0;
					var count = 0;

					for (var rev of models){
						console.log('Compare (' + rev.id + ', ' + deletedId + ')');
						sum += rev.rating;
						count++;
					}

					var average = sum / count;
					
					if (deletedId !== null){
						console.log('Average is ' + average);
						console.log('Sum is ' + sum);
						console.log('Count is ' + count);
					}

					Bathroom.updateAll({'id': id}, {'rating': average}, function(bathroomErr, info){
						if (bathroomErr){
							var error = new Error();
							error.message = 'Could not update bathroom rating';
							error.statusCode = 404;
							console.log(error.toString());
							next(error);
						}else{
							next();
						}
					});
				}
		});
	 }
};
