'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var loopBackPassPort = require('loopback-component-passport');
var PassportConfigurator = loopBackPassPort.PassportConfigurator;
var passportConfigurator = PassportConfigurator(app);


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});

//enable http session
app.use(loopback.session({secret: 'looforpoops'}));

//attempto build the providers/passport config
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