var utils = require("./utils");
var clone = require("clone");

function handleError (err, res) {
  res.status(400);
  res.send({ error: err });
}

// POST /deploy/:app/:env/:version
exports.deploy = function (req, res) {
  var app = req.params.app;
  var env = req.params.env;
  var version = req.params.version;
  var eb = req.app.eb;
  var config = req.app.config;

  var envConfig = utils.getEnvironmentConfig(env, config);

  if (!envConfig) {
    return handleError("No environment defined for " + env, res);
  }

  envConfig = clone(envConfig);
  envConfig.VersionLabel = version;

  // Check application existence on AWS
  doesApplicationExist(eb, app).then(function (exists) {
    // If Application doesn't exist, then it can't have an ApplicationVersion, so error out
    if (!exists) {
      return handleError("No Application on AWS for " + app, res);
    }

    // Create environment if it doesn't exist and update
    return createEnvironment(eb, envConfig);
  }).then(function (data) {
    res.send(data); 
  }, function (err) {
    handleError(err, res);
  });
};

// Determines if the application exists or not
// on AWS
function doesApplicationExist (eb, appName) {
  return eb.describeApplications({ ApplicationNames: [appName] }).then(function (data) {
    return !!data.Applications.length;
  });
}
  
function createEnvironment (eb, envConfig) {
  return eb.describeEnvironments({ EnvironmentNames: [envConfig.EnvironmentName] }).then(function (data) {
    // Update environment with version
    if (data.Environments.length && data.Environments[0].Status !== "Terminated") {
      return eb.updateEnvironment({ EnvironmentName: envConfig.EnvironmentName, VersionLabel: envConfig.VersionLabel });
    }
    // Create environment with all configuration
    else {
      return eb.createEnvironment(envConfig);
    }
  });
}
