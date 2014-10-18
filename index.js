var express = require("express");
var logger = require("morgan");
var utils = require("./lib/utils");
var manifest = require("./package.json");
var routes = require("./lib/routes");
var EB = require("./lib/eb");
var env = process.env.NODE_ENV;
var isTest = env === "test";
var sproutConfig = utils.normalizeConfig(isTest ? require("./test/config.json") : require("./config.json"));
var port = sproutConfig.port || 9999;

var app = module.exports = express();
app.config = sproutConfig;
app.eb = new EB(isTest ? ({ mock: true }) : sproutConfig.AWSCredentials);

if (!isTest) {
  app.use(logger());
}

/**
 * Routes
 */

app.post("/deploy/:app/:env/:version", routes.deploy);


/**
 * Start up
 */

console.log("Running sprout-deploy " + manifest.version + " in '" + env + "' environment on port " + port);
app.listen(port);
