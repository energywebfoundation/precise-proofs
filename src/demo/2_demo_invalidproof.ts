import {PreciseProofs} from '..'
import { printMerkleTree } from '../utils';
import {demoinput} from './demoutils';

console.log('\n\n### Object ###\n')
console.log(demoinput)

console.log('\n\n### Leafs ###\n')
const leafs = PreciseProofs.createLeafs(demoinput) 
console.log(leafs)

console.log('\n\n### The Merkle Tree ###\n')
const merkleTree = PreciseProofs.createMerkleTree(leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash))
const rootHash = PreciseProofs.getRootHash(merkleTree)
console.log(merkleTree)
console.log("\n Root hash:" + rootHash)
printMerkleTree(merkleTree, leafs)

console.log('\n\n### Proof ###\n')
const theProof = PreciseProofs.createProof('street', leafs, false)
theProof.value = 'something that is not true'
console.log(theProof)

console.log("\nVerifying the proof to the root hash: " + rootHash)
console.log("Result: " + PreciseProofs.verifyProof(rootHash, theProof))