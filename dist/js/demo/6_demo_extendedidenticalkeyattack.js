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
const schema = leafs.map((leaf) => leaf.key);
const extendedTreeHash = __1.PreciseProofs.createExtendedTreeRootHash(rootHash, schema);
console.log(merkleTree);
console.log("\nRoot hash:" + rootHash);
console.log("Extended root hash:" + extendedTreeHash);
utils_1.printMerkleTree(merkleTree, leafs, schema);
console.log('\n\n### Extended Proof ###\n');
const extendedProof = __1.PreciseProofs.createProof('street', leafs, true);
console.log(extendedProof);
console.log("\nVerifying the proof to the extended root hash: " + extendedTreeHash);
console.log("Result: " + __1.PreciseProofs.verifyProof(extendedTreeHash, extendedProof, schema));
console.log('\n\n-------------------------------------------');
console.log('\n\n### Create an injected leaf ###\n');
const leafs2 = __1.PreciseProofs.createLeafs(demoutils_1.demoinput);
const injectedKey = 'gpsLongitude';
leafs2[0] = {
    key: injectedKey,
    value: 'Wall Street',
    salt: 'AmethystBambooSalt',
    hash: ''
};
leafs2[0].hash = __1.PreciseProofs.hash(leafs2[0].key + leafs2[0].value + leafs2[0].salt);
console.log('\n\n### The Funny Merkle Tree ###\n');
const merkleTree2 = __1.PreciseProofs.createMerkleTree(leafs2.map((leaf) => leaf.hash));
const rootHash2 = __1.PreciseProofs.getRootHash(merkleTree2);
const schema2 = leafs2.map((leaf) => leaf.key);
const extendedTreeHash2 = __1.PreciseProofs.createExtendedTreeRootHash(rootHash2, schema2);
console.log(merkleTree2);
console.log("\nRoot hash:" + rootHash2);
console.log("Extended root hash:" + extendedTreeHash2);
utils_1.printMerkleTree(merkleTree2, leafs2, schema2);
console.log('\n\n### Extended funny proof ###\n');
const extendedProof2 = __1.PreciseProofs.createProof(injectedKey, leafs2, true, merkleTree2);
console.log(extendedProof2);
console.log("\nVerifying the funny proof to the extended root hash: " + extendedTreeHash2);
console.log("Result: " + __1.PreciseProofs.verifyProof(extendedTreeHash2, extendedProof2, schema2));
//# sourceMappingURL=6_demo_extendedidenticalkeyattack.js.map