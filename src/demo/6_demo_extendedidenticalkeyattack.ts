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
const schema = leafs.map((leaf: PreciseProofs.Leaf) => leaf.key)
const extendedTreeHash = PreciseProofs.createExtendedTreeRootHash(rootHash, schema)
console.log(merkleTree)
console.log("\nRoot hash:" + rootHash)
console.log("Extended root hash:" + extendedTreeHash)
printMerkleTree(merkleTree, leafs, schema)


console.log('\n\n### Extended Proof ###\n')
const extendedProof = PreciseProofs.createProof('street', leafs, true)
console.log(extendedProof)


console.log("\nVerifying the proof to the extended root hash: " + extendedTreeHash)
console.log("Result: " + PreciseProofs.verifyProof(extendedTreeHash, extendedProof, schema))

console.log('\n\n-------------------------------------------')

console.log('\n\n### Create an injected leaf ###\n')
const leafs2 = PreciseProofs.createLeafs(demoinput)
const injectedKey = 'gpsLongitude'
leafs2[0] = {
    key: injectedKey,
    value: 'Wall Street',
    salt: 'AmethystBambooSalt',
    hash: ''
}
leafs2[0].hash = PreciseProofs.hash(leafs2[0].key+leafs2[0].value+leafs2[0].salt)

console.log('\n\n### The Funny Merkle Tree ###\n')
const merkleTree2 = PreciseProofs.createMerkleTree(leafs2.map((leaf: PreciseProofs.Leaf) => leaf.hash))
const rootHash2 = PreciseProofs.getRootHash(merkleTree2)
const schema2 = leafs2.map((leaf: PreciseProofs.Leaf) => leaf.key)
const extendedTreeHash2 = PreciseProofs.createExtendedTreeRootHash(rootHash2, schema2)
console.log(merkleTree2)
console.log("\nRoot hash:" + rootHash2)
console.log("Extended root hash:" + extendedTreeHash2)
printMerkleTree(merkleTree2, leafs2, schema2)

console.log('\n\n### Extended funny proof ###\n')
const extendedProof2 = PreciseProofs.createProof(injectedKey, leafs2, true, merkleTree2)
console.log(extendedProof2)


console.log("\nVerifying the funny proof to the extended root hash: " + extendedTreeHash2)
console.log("Result: " + PreciseProofs.verifyProof(extendedTreeHash2, extendedProof2, schema2))
