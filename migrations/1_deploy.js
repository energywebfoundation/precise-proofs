var PrivateContract = artifacts.require("./PreciseProofCommitmentRegistry.sol");
var Verifier = artifacts.require("./Verifier.sol");

module.exports = function(deployer) {
  deployer.deploy(PrivateContract);
  deployer.deploy(Verifier);
};
