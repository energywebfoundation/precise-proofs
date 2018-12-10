"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const utils_1 = require("./utils");
const crypto = require("crypto");
var PreciseProofs;
(function (PreciseProofs) {
    PreciseProofs.printTree = utils_1.printMerkleTree;
    PreciseProofs.hash = (input) => {
        return ethereumjs_util_1.bufferToHex(ethereumjs_util_1.sha3(input)).substr(2);
    };
    const getSalt = (length, encoding = 'base64') => {
        return crypto.randomBytes(length).toString(encoding).slice(0, length);
    };
    PreciseProofs.getRootHash = (merkleTree) => {
        return merkleTree[merkleTree.length - 1][0];
    };
    PreciseProofs.sortLeafsByKey = (leafs) => {
        return leafs
            .map((leaf) => PreciseProofs.hash(leaf.key))
            .sort()
            .map((theHash) => leafs.find((leaf) => theHash === PreciseProofs.hash(leaf.key)));
    };
    PreciseProofs.sortSchema = (schema) => {
        return schema
            .map(key => PreciseProofs.hash(key))
            .sort()
            .map(keyHash => schema.find(key => keyHash === PreciseProofs.hash(key)));
    };
    PreciseProofs.canonizeValue = (value) => {
        const type = typeof value;
        switch (type) {
            case 'string':
                return value;
            case 'number':
            case 'boolean':
            case 'object':
                return JSON.stringify(value);
            default:
                throw new Error('Unsupported value type ' + type);
        }
    };
    PreciseProofs.createMerkleTree = (leafHashes) => {
        const tree = [leafHashes];
        let lowerLevel = leafHashes;
        while (lowerLevel.length > 1) {
            const newLevel = [];
            for (let i = 0; i < lowerLevel.length - 1; i = i + 2) {
                newLevel.push(PreciseProofs.hash(lowerLevel[i] + lowerLevel[i + 1]));
            }
            tree.push(newLevel);
            lowerLevel = tree.length > 1 && lowerLevel.length % 2 != 0 ?
                newLevel.concat(lowerLevel[lowerLevel.length - 1]) :
                newLevel;
        }
        return tree;
    };
    PreciseProofs.hashSchema = (schema) => {
        return PreciseProofs.hash(schema.reduce((aggregated, value) => aggregated + value));
    };
    PreciseProofs.createExtendedTreeRootHash = (merkleTreeRootHash, schema) => {
        return PreciseProofs.hash(merkleTreeRootHash + PreciseProofs.hashSchema(PreciseProofs.sortSchema(schema)));
    };
    PreciseProofs.createLeafs = (inputObject, salts) => {
        const objectKeys = PreciseProofs.sortSchema(Object.keys(inputObject));
        if (salts && objectKeys.length !== salts.length) {
            throw new Error('Number of object keys and salts is not equal.');
        }
        return objectKeys.map((key, index) => {
            const canonizedValue = PreciseProofs.canonizeValue(inputObject[key]);
            const salt = salts ? salts[index] : getSalt(16);
            const hashValue = PreciseProofs.hash(key + canonizedValue + salt);
            return {
                key: key,
                value: canonizedValue,
                salt: salt,
                hash: hashValue
            };
        });
    };
    const createPath = (merkleTree, leafToProof) => {
        const merkleTreePath = [];
        let currentHash = leafToProof.hash;
        let remainder = [];
        for (let i = 0; i < merkleTree.length - 1; i++) {
            const currentLevel = merkleTree[i].concat(remainder);
            const index = currentLevel.findIndex(hash => hash === currentHash);
            if (index + 1 < currentLevel.length || currentLevel.length % 2 === 0) {
                let pathElement;
                if (index % 2 === 0) {
                    pathElement = currentLevel[index + 1];
                    merkleTreePath.push({ right: pathElement });
                }
                else {
                    pathElement = currentLevel[index - 1];
                    merkleTreePath.push({ left: pathElement });
                }
                currentHash = merkleTree[i + 1][Math.floor(index / 2)];
            }
            remainder = currentLevel.length % 2 === 1 ? [currentLevel[currentLevel.length - 1]] : [];
        }
        return merkleTreePath;
    };
    const findLeaf = (leafs, key) => {
        const leaf = leafs.find((l) => l.key === key);
        if (!leaf) {
            throw new Error('Could not find leaf with the key ' + key);
        }
        return leaf;
    };
    PreciseProofs.createProof = (key, leafs, withSchema, existingMerkleTree) => {
        const sortedLeafs = PreciseProofs.sortLeafsByKey(leafs);
        const merkleTree = existingMerkleTree ? existingMerkleTree : PreciseProofs.createMerkleTree(sortedLeafs.map((leaf) => leaf.hash));
        const leafToProve = findLeaf(sortedLeafs, key);
        const proof = {
            key: key,
            value: leafToProve.value,
            salt: leafToProve.salt,
            proofPath: createPath(merkleTree, leafToProve)
        };
        return withSchema ? Object.assign({}, proof, { schemaHash: PreciseProofs.hashSchema(sortedLeafs.map((leaf) => leaf.key)) }) : proof;
    };
    const pathForPostion = (schemaLength, position) => {
        const positions = Array(schemaLength).fill(null).map((element, index) => ({
            key: index.toString(),
            value: null,
            salt: null,
            hash: PreciseProofs.hash(index.toString())
        }));
        const theLeaf = findLeaf(positions, position.toString());
        const merkleTree = PreciseProofs.createMerkleTree(positions.map((leaf) => leaf.hash));
        const path = createPath(merkleTree, theLeaf);
        let stringPath = '';
        path.forEach(element => {
            if (element.right) {
                stringPath = '0' + stringPath;
            }
            else if (element.left) {
                stringPath = '1' + stringPath;
            }
            else {
                throw new Error('Invalid proof path element');
            }
        });
        return parseInt(stringPath, 2);
    };
    PreciseProofs.verifyProof = (rootHash, proof, schema) => {
        //TODO prevent duplicate keys in schema
        let currentHash = PreciseProofs.hash(proof.key + proof.value + proof.salt);
        let position = '';
        for (let i = 0; i < proof.proofPath.length; i++) {
            const currentPathElement = proof.proofPath[i];
            if (currentPathElement.right) {
                currentHash = PreciseProofs.hash(currentHash + currentPathElement.right);
                position = '0' + position;
            }
            else if (currentPathElement.left) {
                currentHash = PreciseProofs.hash(currentPathElement.left + currentHash);
                position = '1' + position;
            }
            else {
                throw new Error('Invalid proof path element');
            }
        }
        if (proof.schemaHash) {
            if (schema) {
                const maxDepth = Math.ceil(Math.log2(schema.length));
                const sortedSchema = PreciseProofs.sortSchema(schema);
                const schemaIndex = sortedSchema.findIndex((key) => key === proof.key);
                const extendedTreeRootHash = PreciseProofs.hash(currentHash + PreciseProofs.hashSchema(sortedSchema));
                if (schema.length === 1) {
                    return position === '' && extendedTreeRootHash === rootHash;
                }
                return pathForPostion(schema.length, schemaIndex) === parseInt(position, 2) && extendedTreeRootHash === rootHash;
            }
            else {
                throw new Error('Schema is needed for extended tree proof.');
            }
        }
        else {
            return currentHash === rootHash;
        }
    };
})(PreciseProofs = exports.PreciseProofs || (exports.PreciseProofs = {}));
//# sourceMappingURL=index.js.map