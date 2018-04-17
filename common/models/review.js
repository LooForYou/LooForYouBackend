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

    Review.observe('after save', function(context, next){
			if (context.isNewInstance !== undefined){
				if (context.isNewInstance){
					context.instance.time_created = new Date();
				}else{
					context.instance.time_updated = new Date();
				}
			}

			next();
		});
};
