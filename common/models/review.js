'use strict';

module.exports = function(Review) {
	/**
	 * Declaration to remote method for incrementing likes.
	 * Endpoint path is /{Review ID}/increment-likes
	 */
	Review.remoteMethod('incrementLikes', {
        accepts:[
            {arg: 'id', type: 'string', required: true}
        ],
		http: {path: '/:id/increment-likes', verb: 'put'},
		returns: {type: 'boolean', root: true}
	});

	/**
	 * Declaration to remote method for decrementing likes.
	 * Endpoint path is /{Review ID}/increment-likes
	 */
	Review.remoteMethod('decrementLikes', {
		accepts:[
			{arg: 'id', type: 'string', required: true}
		],
		http: {path:'/:id/decrement-likes', verb: 'put'},
		returns: {type: 'boolean', root: true}
	});
	
	/**
	 * Implementation to remote method for incrementing likes
	 * 
	 * @param {ID of Review from database} id 
	 * @param {callback function} callback 
	 */
	Review.incrementLikes = function(id, callback){
		//Given the id, it finds the review
		Review.findById(id, function(accountError, instance){
			if (accountError){
				var error = new Error();
                error.message = 'Account not found!';
                error.statusCode = 404;
                callback(error);
			}else{
				//Incrementing the current likes by 1
				var incrementedLikes = instance.likes + 1;

				//Once incremented saves the result back into the database
				Review.updateAll({"id": id}, {"likes" : incrementedLikes }, function(updateError, info){
					if (updateError){
                		var error = new Error();
               			error.message = 'Update failed!';
                		error.statusCode = 404;
                		callback(updateError);
					}else{
						//Returns true if update was successful
						if (info.count >= 1)
							callback(null, true);
						else
							callback(null, false);
					}
				});
			}
		});
	}

	/**
	 * Implementation of remote method for decrementing likes
	 * 
	 * @param {ID for Review in database} id 
	 * @param {callback function} callback 
	 */
	Review.decrementLikes = function(id, callback){
		//Finds review given id
		Review.findById(id, function(accountError, instance){
			if (accountError){
				var error = new Error();
                error.message = 'Account not found!';
                error.statusCode = 404;
                callback(error);
			}else{
				//Decrementing current likes by 1
				var decrementLikes = instance.likes - 1;
				//Saving result back into database
				Review.updateAll({"id": id}, {"likes" : decrementLikes }, function(updateError, info){
					if (updateError){
                		var error = new Error();
               			error.message = 'Update failed!';
                		error.statusCode = 404;
                		callback(updateError);
					}else{
						//Returns true if update was successful
						if (info.count >= 1)
							callback(null, true);
						else
							callback(null, false);
					}
				});
			}
		});
	}

	/**
	 * Listener for the moment a Review is about to be saved in the database
	 * Can be for creating new instances or updating old ones
	 * This is for creating a timestamp for newly created Reviews
	 * and a timestamp for Reviews updated
	 */
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

	/**
	 * Listener for the moment a Review has already saved to the database
	 * Can by for creating new instaces or updating old ones
	 * Used to check when a Review has been newly added or updated so
	 * that the average rating in Bathroom models can be recalculated
	 */
     Review.observe('after save', function(context, next){
 
		if (context.isNewInstance){
		 	calculateRating(context.instance.bathroomId, next, null);
		 }else{
			calculateRating(context.data.bathroomId, next, null);
		 }
	 });

	 /**
	  * Listener for the moment a Review is about to be deleted from the database
	  * Used only for deleting 
	  * Used to check if a Review is about to be deleted so that the average
	  * rating in Bathrooms can be recalculated
	  */
	 Review.observe('before delete', function(context, next){
		 if (context.where){
			Review.findById(context.where.id, function(err, result){

				calculateRating(result.bathroomId, next, result.id);
			});
	 	}
	 });

	 /**
	  * Helper method to recalculate the average rating for bathrooms
	  * 
	  * @param {ID of Bathroom in database} id 
	  * @param {Function to call to complete add, delete, or update} next 
	  * @param {Null if a Review is being added or updated, the id of the Review if it is being deleted} deletedId 
	  */
	 function calculateRating(id, next, deletedId){
		var Bathroom = Review.app.models.Bathroom;
		
		//Find Reviews for a bathroom given id excldues id of Review that is about to be deleted
		Review.find({where: {'bathroomId': id, 'id': {neq: deletedId}}}, function(reviewErr, models){
				if (reviewErr){
					var error = new Error();
					error.message = 'Couldnt find reviews for bathroom!';
					error.statusCode = 404;
					next(error);
				}else{
					var sum = 0;
					var count = 0;
					
					//Calculating the sum and count of all the reviews for a bathroom
					for (var rev of models){
						sum += rev.rating;
						count++;
					}
					
					//Calculating average
					var average = sum / count;
					
					//Saving average to Bathroom database
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
