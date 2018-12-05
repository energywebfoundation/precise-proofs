import {PreciseProofs} from './'
import { printMerkleTree } from './debug';


const test = {
    operationalSince: 0,
    capacityWh: 10,
    country: "Germany",
    region: "Saxony",
    active: true,
    nestedObject: {
        id: 1
    },
    zip: "09648",
    city: "Mittweida",
    street: "Main Street",
    houseNumber: "101",
    gpsLatitude: "0",
    gpsLongitude: "0"

}



console.log('\n\n### Object ###\n')

console.log(test)

console.log('\n\n### Leafs ###\n')
const leafs = PreciseProofs.createLeafs(test) 

console.log(leafs)

const merkleTree = PreciseProofs.createMerkleTree(leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash))
console.log('\n\n### Merkle Tree ###\n')

console.log(merkleTree)
printMerkleTree(merkleTree, leafs, leafs.map((leaf: PreciseProofs.Leaf) => leaf.key))

const rootHash = merkleTree[merkleTree.length - 1][0]

const theProof = PreciseProofs.createProof('street', leafs, false)
console.log('\n\n### Proof ###\n')
console.log(theProof)
console.log(PreciseProofs.verifyProof(rootHash, theProof))

console.log('\n\n### Invalid Proof ###\n')
theProof.value = 'blaa'
console.log(theProof)
console.log(PreciseProofs.verifyProof(rootHash, theProof))

const extendedProof = PreciseProofs.createProof('city', leafs, true)
console.log('\n\n### Extended Proof ###\n')
console.log(extendedProof)
const schema = leafs.map((leaf: PreciseProofs.Leaf) => leaf.key)
const extendedTreeHash = PreciseProofs.createExtendedTreeRootHash(rootHash, schema)
console.log(PreciseProofs.verifyProof(extendedTreeHash, extendedProof, schema))

console.log('\n\n### Identical key attack ###\n')

const leafs2 = PreciseProofs.createLeafs(test) 
leafs2[0] = {
    key: 'country',
    value: 'gb',
    hash: PreciseProofs.hash('country' + 'gb' + '1234567'),
    salt: '1234567'
}

const merkleTree2 = PreciseProofs.createMerkleTree(leafs2.map((leaf: PreciseProofs.Leaf) => leaf.hash))
printMerkleTree(merkleTree2, leafs2, leafs2.map((leaf: PreciseProofs.Leaf) => leaf.key))



