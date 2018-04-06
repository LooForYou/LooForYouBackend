'use strict';

module.exports = function(Review) {
    Review.beforeCreate = function (next, res){
		res.time_created = Date.now();
		next();
	};
};
