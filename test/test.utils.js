var expect = require("chai").expect;
var utils = require("../lib/utils");
var testConfig = require("./config.json");

describe("utils", function () {
  describe("normalizeConfig", function () {
    it("adds empty application array", function () {
      var config = utils.normalizeConfig({});
      expect(config.Applications).to.be.an("array"); 
      expect(config.Applications.length).to.be.equal(0);
    });
    it("adds empty environment array", function () {
      var config = utils.normalizeConfig({ Applications: [{
        ApplicationName: "yeah",
        Description: "woo"
      }]});
      expect(config.Applications[0].Environments).to.be.an("array"); 
      expect(config.Applications[0].Environments.length).to.be.equal(0);
    });
  });

  describe("getEnvironmentConfig", function () {
    it("fetches an environment that exists", function () {
      var config = utils.getEnvironmentConfig("api-service-dev", testConfig);
      expect(config.EnvironmentName).to.be.equal("api-service-dev");
    });
    it("fetches an environment that does not exist", function () {
      var config = utils.getEnvironmentConfig("nope", testConfig);
      expect(config).to.be.equal(null);
    });
  });
});
