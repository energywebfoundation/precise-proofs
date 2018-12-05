"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
require("mocha");
const __1 = require("..");
describe('#####A', () => {
    const maxObjectSize = 65;
    const createTestJson = (length) => {
        const theObject = {};
        for (let i = 0; i < length; i++) {
            theObject[i] = 'value ' + i;
        }
        return theObject;
    };
    for (let i = 1; i < maxObjectSize; i++) {
        it(`Should verify proof for all keys object with size ${i} `, () => {
            const testJson = createTestJson(i);
            const leafs = __1.PreciseProofs.createLeafs(testJson);
            const merkleTree = __1.PreciseProofs.createMerkleTree(leafs.map((leaf) => leaf.hash));
            const proofs = Object.keys(testJson).map(key => __1.PreciseProofs.createProof(key, leafs, true, merkleTree));
            const schema = leafs.map((leaf) => leaf.key);
            const extendedTreeHash = __1.PreciseProofs.createExtendedTreeRootHash(merkleTree[merkleTree.length - 1][0], schema);
            proofs.forEach((proof) => {
                __1.PreciseProofs.verifyProof(extendedTreeHash, proof, schema);
                chai_1.assert.isTrue(__1.PreciseProofs.verifyProof(extendedTreeHash, proof, schema), `Proof could not be verified for key ${proof.key}`);
            });
        }).timeout(10000);
    }
});
//# sourceMappingURL=SortedMerkleTree.js.map