import { assert } from 'chai'
import 'mocha'
import { PreciseProofs } from '..';

describe('#####A', () => {
    const maxObjectSize = 65

    const createTestJson = (length: number): any => {
        const theObject = {}
        for (let i = 0; i < length; i++) {
            theObject[i] = 'value ' + i
        }
        return theObject
    }

    for(let i = 1; i < maxObjectSize; i++) {
        it(`Should verify proof for all keys object with size ${i} `, () => {
            const testJson = createTestJson(i)
            const leafs = PreciseProofs.createLeafs(testJson)
            const merkleTree = PreciseProofs.createMerkleTree(leafs.map((leaf: PreciseProofs.Leaf) => leaf.hash))
            const proofs = Object.keys(testJson).map(key => 
                PreciseProofs.createProof(key, leafs, true, merkleTree)
            )
            const schema = leafs.map((leaf: PreciseProofs.Leaf) => leaf.key)
            const extendedTreeHash = PreciseProofs.createExtendedTreeRootHash(merkleTree[merkleTree.length - 1][0], schema)
            
            proofs.forEach((proof: PreciseProofs.Proof) => {
                
                PreciseProofs.verifyProof(extendedTreeHash, proof, schema)
                assert.isTrue(PreciseProofs.verifyProof(extendedTreeHash, proof, schema), `Proof could not be verified for key ${proof.key}`)
            })
        }).timeout(10000)
    }
})
