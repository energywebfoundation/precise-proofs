import { PreciseProofs } from "..";
import { printMerkleTree } from "../utils";
import { demoinput } from "./demoutils";

const Web3 = require("web3");
const contract = require("truffle-contract");
const contractJson = require("../../../build/contracts/Verifier.json");

const provider = new Web3.providers.HttpProvider("http://localhost:8545");
const Verifier = contract(contractJson);

(async () => {
  Verifier.setProvider(provider);
  const [from] = await new Web3(provider).eth.getAccounts();
  const verifier = await Verifier.new({ from });

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
  const theProof = PreciseProofs.createProof("street", leafs, false);
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

  const result = await verifier.verify(
    key,
    value,
    salt,
    rootHash,
    onChainProof
  );
  console.log("Result: " + result);
})();
