var expect = require("chai").expect;
var request = require("supertest");
var deploy = require("../");
var utils = require("./utils");
var normalizeConfig = require("../lib/utils").normalizeConfig;
var EB = require("../lib/eb");

describe("/deploy/app/env/version", function () {
  beforeEach(function (done) {
    deploy.config = normalizeConfig(require("./config.json"));
    deploy.eb = new EB({ mock: true });
    utils.seedAWS(deploy.eb).then(done);
  });

  it("Application on AWS, Env on AWS, with config", function (done) {
    request(deploy)
      .post("/deploy/api-service/api-service-dev/1.0.0")
      .expect(200)
      .end(function (err, res) {
        deploy.eb.describeEnvironments({ EnvironmentNames: ["api-service-dev"] }).then(function (data) {
          expect(err).to.not.be.ok;
          expect(data.Environments[0].EnvironmentName).to.be.equal("api-service-dev");
          expect(data.Environments[0].VersionLabel).to.be.equal("1.0.0");
          expect(data.Environments[0].Status).to.be.a("string");
          done();
        }, done);
      });
  });

  it("Application on AWS, Env not on AWS, with config", function (done) {
    request(deploy)
      .post("/deploy/api-service/api-service-prod/1.0.0")
      .expect(200)
      .end(function (err, res) {
        deploy.eb.describeEnvironments({ EnvironmentNames: ["api-service-prod"] }).then(function (data) {
          expect(err).to.not.be.ok;
          expect(data.Environments[0].EnvironmentName).to.be.equal("api-service-prod");
          expect(data.Environments[0].VersionLabel).to.be.equal("1.0.0");
          expect(data.Environments[0].Status).to.be.a("string");
          done();
        }, done);
      });
  });

  // Should fail since an ApplicationVersion can not exist without
  // a corresponding Application
  it("Application not on AWS, Env not on AWS, with config, fails", function (done) {
    request(deploy)
      .post("/deploy/sandbox/test-env/1.0.0")
      .expect(400)
      .end(function (err, res) {
        expect(res.body.error).to.be.equal("No Application on AWS for sandbox");
        done();
      });
  });

  it("Fails when no environment config found", function (done) {
    request(deploy)
      .post("/deploy/nope/no-way/maybe")
      .expect(400)
      .end(function (err, res) {
        expect(res.body.error).to.be.equal("No environment defined for no-way");
        done();
      });
  });
});
