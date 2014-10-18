var EBMock = require("eb-mock");
var AWS = require("aws-sdk");
var defer = require("when").defer;

var EB_FUNCTIONS = [
  "createApplication",
  "describeApplications",
  "describeEnvironments",
  "createEnvironment",
  "updateEnvironment",
  "swapEnvironmentCNAMEs",
  "deleteApplication",
  "updateApplication",
  "createApplicationVersion",
  "listAvailableSolutionStacks",
  "terminateEnvironment"
];

function ElasticBeanstalk (config) {
  this.mock = config.mock;
  this._ebInstance = config.mock ? new EBMock() : new AWS.ElasticBeanstalk(config || {});
}
module.exports = ElasticBeanstalk;

EB_FUNCTIONS.forEach(function (fn) {
  ElasticBeanstalk.prototype[fn] = function (params) {
    var deferred = defer();
    this._ebInstance[fn](params || {}, function (err, data) {
      if (err) deferred.reject(err);
      else deferred.resolve(data);
    });
    return deferred.promise;
  };
});
