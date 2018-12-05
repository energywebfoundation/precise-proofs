"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const debug_1 = require("./debug");
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
};
console.log('\n\n### Object ###\n');
console.log(test);
console.log('\n\n### Leafs ###\n');
const leafs = _1.PreciseProofs.createLeafs(test);
console.log(leafs);
const merkleTree = _1.PreciseProofs.createMerkleTree(leafs.map((leaf) => leaf.hash));
console.log('\n\n### Merkle Tree ###\n');
console.log(merkleTree);
debug_1.printMerkleTree(merkleTree, leafs, leafs.map((leaf) => leaf.key));
const rootHash = merkleTree[merkleTree.length - 1][0];
const theProof = _1.PreciseProofs.createProof('street', leafs, false);
console.log('\n\n### Proof ###\n');
console.log(theProof);
console.log(_1.PreciseProofs.verifyProof(rootHash, theProof));
console.log('\n\n### Invalid Proof ###\n');
theProof.value = 'blaa';
console.log(theProof);
console.log(_1.PreciseProofs.verifyProof(rootHash, theProof));
const extendedProof = _1.PreciseProofs.createProof('city', leafs, true);
console.log('\n\n### Extended Proof ###\n');
console.log(extendedProof);
const schema = leafs.map((leaf) => leaf.key);
const extendedTreeHash = _1.PreciseProofs.createExtendedTreeRootHash(rootHash, schema);
console.log(_1.PreciseProofs.verifyProof(extendedTreeHash, extendedProof, schema));
console.log('\n\n### Identical key attack ###\n');
const leafs2 = _1.PreciseProofs.createLeafs(test);
leafs2[0] = {
    key: 'country',
    value: 'gb',
    hash: _1.PreciseProofs.hash('country' + 'gb' + '1234567'),
    salt: '1234567'
};
const merkleTree2 = _1.PreciseProofs.createMerkleTree(leafs2.map((leaf) => leaf.hash));
debug_1.printMerkleTree(merkleTree2, leafs2, leafs2.map((leaf) => leaf.key));
//# sourceMappingURL=demo.js.map