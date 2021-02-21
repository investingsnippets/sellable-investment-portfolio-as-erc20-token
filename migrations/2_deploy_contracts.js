var PortfolioToken = artifacts.require("PortfolioToken");

module.exports = function(deployer) {
  deployer.deploy(PortfolioToken, 100, "My Portfolio", "MYP");
};