'use strict';
// const multiparty = require('multiparty');

// const getFileFromRequest = (req) => new Promise((resolve, reject) => {
//     const form = new multiparty.Form();
//     form.parse(req, (err, fields, files) =>{
//         if (err) reject(err);
//         const file = files['file'][0];
//         if (!file) Promise.reject('File was not found in form data.');
//         else resolve(file);
//     });
// });


module.exports = function(Account) {

    Account.remoteMethod('uploadImage', {
        accepts:[
            {arg: 'id', type: 'string', requried: true},
            {arg: 'req', type: 'object', http: {source: 'req'}},
            {arg: 'res', type: 'object', http: {source: 'res'}}
        ],
		http: {path: '/:id/upload-image', verb: 'post'},
		returns: {type: 'object', root: true}
    });
    
    Account.uploadImage = function(id, req, res, cb){
        var Container = Account.app.models.Container;
        var filter = {'id': id};
        Account.exists(id, function(err, exists){
            if (error){
                var error = new Error();
                error.message = 'Account not found!';
                error.statusCode = 404;
                cb(error);
            }else{
                if (exists){
                    Container.upload(req, res, {container: 'looforyouaccounts'}, function (err, result){
                        if (err){
                            var error = new Error();
                            error.message = 'Upload Failed';
                            error.statusCode = 404;
                            cb(error);
                        }else{
                            var url = 'http://ec2-54-183-105-234.us-west-1.compute.amazonaws.com:9000/api/Containers/looforyouaccounts/download/' + result.files[""][0].providerResponse.name;
                            Account.updateAll(filter, {'image_url' : url}, function(err, updateResult){
                                if (err){
                                    var error = new Error();
                                    error.message = 'Recording URL Failed';
                                    error.statusCode = 404;
                                     cb(error);
                                }else{
                                    if (updateResult.count > 0){
                                        cb(null, result);
                                    }else{
                                        var error = new Error();
                                        error.message = 'Nothing Updated';
                                        error.statusCode = 404;
                                        cb(error);
                                    }
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
