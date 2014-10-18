var when = require("when");
var clone = require("clone");
var utils = require("../lib/utils");

function seedAWS (eb) {
  return eb.createApplication({ ApplicationName: "api-service" }).then(function () {
    return eb.createApplicationVersion({ ApplicationName: "api-service", VersionLabel: "1.0.0" });
  }).then(function () {
    return eb.createApplicationVersion({ ApplicationName: "api-service", VersionLabel: "2.0.0" });
  }).then(function () {
    var config = utils.normalizeConfig(require("./config.json"));
    var env = clone(config.Applications[0].Environments[0]);
    env.ApplicationName = "api-service";
    return eb.createEnvironment(env);
  }).then(function(){});
}
exports.seedAWS = seedAWS;
