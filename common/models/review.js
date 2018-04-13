'use strict';

module.exports = function(Review) {
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
