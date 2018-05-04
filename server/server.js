'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var loopBackPassPort = require('loopback-component-passport');
var PassportConfigurator = loopBackPassPort.PassportConfigurator;
var passportConfigurator = PassportConfigurator(app);

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

var config = {};
try {
  config = require('./providers.json');
} catch (err) {
  console.trace(err);
  process.exit(1); // fatal exit
}

//initialize passport
passportConfigurator.init();

//set up related models
passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential
});

//configure passport strategies for third party auth providers
for(var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}
