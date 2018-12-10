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
console.log("\nRoot hash:" + rootHash)
printMerkleTree(merkleTree, leafs)


console.log('\n\n### Proof ###\n')
const proof = PreciseProofs.createProof('street', leafs, false)
console.log(proof)


console.log("\nVerifying the proof to the root hash: " + rootHash)
console.log("Result: " + PreciseProofs.verifyProof(rootHash, proof))

console.log('\n\n-----------------------------------------------------')

console.log('\n\n### Create an injected leaf ###\n')
const leafs2 = PreciseProofs.createLeafs(demoinput) 
leafs2[0] = {
    key: 'street',
    value: 'Wall Street',
    salt: 'AmethystBambooSalt',
    hash: ''
}
leafs2[0].hash = PreciseProofs.hash(leafs2[0].key+leafs2[0].value+leafs2[0].salt)

console.log('\n\n### The Funny Merkle Tree ###\n')
const merkleTree2 = PreciseProofs.createMerkleTree(leafs2.map((leaf: PreciseProofs.Leaf) => leaf.hash))
const rootHash2 = PreciseProofs.getRootHash(merkleTree2)
console.log(merkleTree2)
console.log("\nRoot hash:" + rootHash2)
printMerkleTree(merkleTree2, leafs2)

console.log('\n\n### Fake Proof ###\n')
const proof2 = PreciseProofs.createProof('street', leafs2, false, merkleTree2)
console.log(proof2)

console.log("\nVerifying the fake proof to the root hash: " + rootHash2)
console.log("Result: " + PreciseProofs.verifyProof(rootHash2, proof2))