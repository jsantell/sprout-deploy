var EBMock = require("eb-mock");
var AWS = require("aws-sdk");
var clone = require("clone");

/**
 * Takes a `config` object from a JSON definition most likely
 * and ensures that missing fields that are expected are atleast
 * defined, so we don't get errors later on assuming that Applications
 * and Environments are defined.
 *
 * @param {Object} config
 * @return {Object}
 */

function normalizeConfig (config) {
  config = clone(config || {});
  config.Applications = config.Applications || [];
  config.Applications.forEach(function (app) {
    app.Environments = app.Environments || [];
    app.Environments.forEach(function (env) { env.ApplicationName = app.ApplicationName; });
  });
  return Object.freeze(config);
}
exports.normalizeConfig = normalizeConfig;

/**
 * Takes an environment name and configuration
 * object and returns the matching configuration
 * for the environment, or null, if not found.
 *
 * @param {String} envName
 * @param {Object} config
 * @return {Object|null}
 */

function getEnvironmentConfig (envName, config) {
  var apps = config.Applications, app, env;
  for (var i = 0; i < apps.length; i++) {
    app = apps[i];
    for (var j = 0; j < app.Environments.length; j++) {
      env = app.Environments[j];
      if (env.EnvironmentName === envName) {
        return env;
      }
    }
  }

  return null;
}
exports.getEnvironmentConfig = getEnvironmentConfig;
