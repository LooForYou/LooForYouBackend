<<<<<<< HEAD
'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  //router.get('/', function(req,res) {
    //res.send('Nodemon Test');
  //});
  server.use(router);
};
=======
'use strict';

module.exports = function(server) {
  // Install a `/` route that returns server status
  var router = server.loopback.Router();
  router.get('/', server.loopback.status());
  server.use(router);
};
>>>>>>> 86cc5137946facef227554835d254ec20bbed97f
