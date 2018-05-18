'use strict';

module.exports = function(Account) {

    /**
     * Declaration for uploading images 
     * Specifies endpoint path to be /{Account ID}/upload-image
     */
    Account.remoteMethod('uploadImage', {
        accepts:[
            {arg: 'id', type: 'string', requried: true},
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}}
        ],
		http: {path: '/:id/upload-image', verb: 'post'},
		returns: {type: 'object', root: true}
    });
    
    /**
     * Implementation for uploading images
     * 
     * @param {id of account} id 
     * @param {request with image data used for Container Model} req 
     * @param {response of image upload used for Container Model} res 
     * @param {callback function} cb 
     */
    Account.uploadImage = function(id, req, res, cb){
        var Container = Account.app.models.Container;
        var filter = {'id': id};

        //Checks if account with given id exists
        //If the account is found, exists is true
        //otherwise it is false. 
        Account.exists(id, function(err, exists){
            if (err){
                var error = new Error();
                error.message = 'Account not found!';
                error.statusCode = 404;
                cb(error);
            }else{
                if (exists){
                    //Upload the image to our s3 storage using a Container Model which is built-in
                    Container.upload(req, res, {container: 'looforyouaccounts'}, function (containErr, result){
                        if (containErr){
                            var error = new Error();
                            error.message = 'Upload Failed';
                            error.statusCode = 404;
                            cb(error);
                        }else{
                            var url = 'http://ec2-54-183-105-234.us-west-1.compute.amazonaws.com:9000/api/Containers/looforyouaccounts/download/' + result.files["image"][0].providerResponse.name;
                           //If Container Model successfully uploads the image then updates the Accounts database
                           //with the url of the image
                            Account.updateAll(filter, {'image_url' : url}, function(accountErr, updateResult){
                                if (err){
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
                    error.message = 'Account not found';
                    error.statusCode = 404;
                    cb(error);
                }
            }
        });
    }
};
