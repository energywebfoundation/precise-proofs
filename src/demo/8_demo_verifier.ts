import { PreciseProofs } from "..";
import { printMerkleTree } from "../utils";
import { demoinput } from "./demoutils";
import { VerifierFactory } from "../ethers/VerifierFactory";
import { ethers } from "ethers";
import { BigNumber } from "ethers/utils";

const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545");

(async () => {
  const signer = await provider.getSigner();

  const verifier = await new VerifierFactory(signer).deploy();
  const verifierWithSigner = verifier.connect(signer);

  console.log("\n\n### Object ###\n");
  console.log(demoinput);

  console.log("\n\n### Leafs ###\n");
  const leafs = PreciseProofs.createLeafs(demoinput);
  console.log(leafs);

  console.log("\n\n### The Merkle Tree ###\n");
  const merkleTree = PreciseProofs.createMerkleTree(
    leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash)
  );
  const rootHash = PreciseProofs.getRootHash(merkleTree);
  console.log(merkleTree);
  console.log("\n Root hash:" + rootHash);
  printMerkleTree(merkleTree, leafs);

  console.log("\n\n### Proof ###\n");
  const theProof = PreciseProofs.createProof("0x5B1B89A48C1fB9b6ef7Fb77C453F2aAF4b156d45", leafs, false);
  console.log(theProof);

  console.log("\nVerifying the proof to the root hash: " + rootHash);
  console.log("Result: " + PreciseProofs.verifyProof(rootHash, theProof));

  console.log(
    "\nVerifying the proof to the root hash using on-chain verifier: " +
      rootHash
  );

  const onChainProof = theProof.proofPath.map(p => ({
    left: !!p.left,
    hash: p.left || p.right
  }));

  const { key, value, salt } = theProof;

  const result = await verifierWithSigner.verify(
    key,
    new BigNumber(value),
    salt,
    rootHash,
    onChainProof
  );
  console.log("Result: " + result);
})();
