"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const utils_1 = require("../utils");
const demoutils_1 = require("./demoutils");
console.log('\n\n### Object ###\n');
console.log(demoutils_1.demoinput);
console.log('\n\n### Leafs ###\n');
const leafs = __1.PreciseProofs.createLeafs(demoutils_1.demoinput);
console.log(leafs);
console.log('\n\n### The Merkle Tree ###\n');
const merkleTree = __1.PreciseProofs.createMerkleTree(leafs.map((leaf) => leaf.hash));
const rootHash = __1.PreciseProofs.getRootHash(merkleTree);
console.log(merkleTree);
console.log("\nRoot hash:" + rootHash);
utils_1.printMerkleTree(merkleTree, leafs);
console.log('\n\n### Proof ###\n');
const proof = __1.PreciseProofs.createProof('street', leafs, false);
console.log(proof);
console.log("\nVerifying the proof to the root hash: " + rootHash);
console.log("Result: " + __1.PreciseProofs.verifyProof(rootHash, proof));
console.log('\n\n-----------------------------------------------------');
console.log('\n\n### Create an injected leaf ###\n');
const leafs2 = __1.PreciseProofs.createLeafs(demoutils_1.demoinput);
leafs2[0] = {
    key: 'street',
    value: 'Wall Street',
    salt: 'AmethystBambooSalt',
    hash: ''
};
leafs2[0].hash = __1.PreciseProofs.hash(leafs2[0].key + leafs2[0].value + leafs2[0].salt);
console.log('\n\n### The Funny Merkle Tree ###\n');
const merkleTree2 = __1.PreciseProofs.createMerkleTree(leafs2.map((leaf) => leaf.hash));
const rootHash2 = __1.PreciseProofs.getRootHash(merkleTree2);
console.log(merkleTree2);
console.log("\nRoot hash:" + rootHash2);
utils_1.printMerkleTree(merkleTree2, leafs2);
console.log('\n\n### Fake Proof ###\n');
const proof2 = __1.PreciseProofs.createProof('street', leafs2, false, merkleTree2);
console.log(proof2);
console.log("\nVerifying the fake proof to the root hash: " + rootHash2);
console.log("Result: " + __1.PreciseProofs.verifyProof(rootHash2, proof2));
//# sourceMappingURL=3_demo_identicalkeyattack.js.map