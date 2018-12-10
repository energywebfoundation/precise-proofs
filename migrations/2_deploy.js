var PrivateContract = artifacts.require("./PreciseProofCommitmentRegistry.sol");

module.exports = function(deployer) {
  deployer.deploy(PrivateContract);
};
