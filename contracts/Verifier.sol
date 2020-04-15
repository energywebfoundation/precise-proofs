pragma solidity ^0.5.12;
pragma experimental ABIEncoderV2;

contract Verifier {
  struct Proof {
      bool left;
      bytes32 hash;
    }

    function verify(address key, uint value, string memory salt, bytes32 rootHash, Proof[] memory proof) public pure returns (bool) {
        bytes32 hash = keccak256(abi.encodePacked(key, value, salt));
        
        for(uint i=0; i<proof.length; i++) {
            Proof memory p = proof[i];
            if (p.left) {
                hash = keccak256(abi.encodePacked(p.hash, hash));
            } else {
                hash = keccak256(abi.encodePacked(hash, p.hash));
            }
        }
        
        return rootHash == hash;
    }
}