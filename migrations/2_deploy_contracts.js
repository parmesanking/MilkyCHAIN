// migrating the appropriate contracts
var FarmerRole = artifacts.require("./FarmerRole.sol");
var TransporterRole = artifacts.require("./TransporterRole.sol");
var BottlingFarmRole = artifacts.require("./BottlingFarmRole.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(FarmerRole);
  deployer.deploy(TransporterRole);
  deployer.deploy(BottlingFarmRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
