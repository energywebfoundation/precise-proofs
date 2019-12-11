pragma solidity ^0.5.12;


// This is only for demonstration purposes
// Not made for production
contract PreciseProofCommitmentRegistry {

    struct Commitment {
        string merkleRoot;
        string schema;
    }

    event NewCommitment(address indexed by, string indexed name);

    mapping(address => mapping(string => Commitment)) internal commitments;

    function commitment(string memory _name, string memory _hash, string memory _schema) public returns (bool) {
        commitments[msg.sender][_name] = Commitment(_hash, _schema);
        emit NewCommitment(msg.sender, _name);
        return true;
    }

    function getCommitment(address _by, string calldata _name) external view returns (string memory, string memory) {
        return (commitments[_by][_name].merkleRoot, commitments[_by][_name].schema);
    }

    function checkCommitment(address _by, string calldata _name, string calldata _hash) external view returns (bool) {
        return (keccak256(bytes(commitments[_by][_name].merkleRoot)) == keccak256(bytes(_hash)));
    }
}