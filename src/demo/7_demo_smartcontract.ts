import {PreciseProofs} from '..'
import { printMerkleTree } from '../utils';
import {demoinput, newCommitment, getCommitment, localAccounts} from './demoutils';


console.log('\n\n### Object ###\n')
console.log(demoinput)


console.log('\n\n### Leafs ###\n')
const leafs = PreciseProofs.createLeafs(demoinput) 
console.log(leafs)


console.log('\n\n### The Merkle Tree ###\n')
const merkleTree = PreciseProofs.createMerkleTree(leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash))
const rootHash = merkleTree[merkleTree.length - 1][0]
const schema = leafs.map((leaf: PreciseProofs.Leaf) => leaf.key)
const extendedTreeHash = PreciseProofs.createExtendedTreeRootHash(rootHash, schema)
console.log(merkleTree)
console.log("\nRoot hash:" + rootHash)
console.log("Extended root hash:" + extendedTreeHash)
printMerkleTree(merkleTree, leafs, schema)


console.log('\n\n### Publish commitment to a Smart Contract###\n')
localAccounts().then((accounts) => {
    let from = accounts[0]
    console.log("account " + from)


    newCommitment("test", extendedTreeHash, schema, {from: from})
    .on('transactionHash', function(hash){
        console.log("Transaction hash: " + hash)
    })
    .then((receipt) => {
        console.log('\n\n### Extended Proof ###\n')
        const extendedProof = PreciseProofs.createProof('street', leafs, true)
        console.log(extendedProof)

        //Verifier reads the commitment from the contract then verifies
        getCommitment(from, "test").then((comm) => {
            console.log("\nVerifying the proof to the extended root hash: " + comm.merkleRoot)
            console.log("Result: " + PreciseProofs.verifyProof(comm.merkleRoot, extendedProof, comm.schema))
        })
    })
})






