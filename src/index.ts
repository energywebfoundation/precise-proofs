import { printMerkleTree } from "./utils";
import * as crypto from "crypto";
import * as utils from "web3-utils";
import { BigNumber, ethers } from "ethers";

function isAddress(address) {
    try {
      ethers.utils.getAddress(address);
    } catch (e) {
      return false;
    }

    return true;
}

export namespace PreciseProofs {
  export const printTree = printMerkleTree;

  export interface Leaf {
    key: string;
    value: string;
    salt: string;
    hash: string;
  }

  export interface Proof {
    key: string;
    value: string;
    salt: string;
    schemaHash?: string;
    proofPath: any[];
  }

  export const hash = (...params: any[]): string => {
    return utils.soliditySha3(...params);
  };

  const getSalt = (byteLength: number, encoding: string = "base64") => {
    return crypto
      .randomBytes(byteLength)
      .toString(encoding)
  };

  export const getRootHash = (merkleTree: any[][]) => {
    return merkleTree[merkleTree.length - 1][0];
  };

  export const sortLeafsByKey = (leafs: Leaf[]): Leaf[] =>
    leafs.sort((a, b) => hash(a.key).localeCompare(hash(b.key)));

  export const sortSchema = (schema: string[]): string[] =>
    schema.sort((a, b) => hash(a).localeCompare(hash(b)));

  export const canonizeValue = (value: any): string => {
    if (BigNumber.isBigNumber(value)) {
      return value.toString();
    }

    const type = typeof value;
    switch (type) {
      case "string":
        return isAddress(value) ? value : Buffer.from(value).toString("base64");
      case "number":
      case "boolean":
      case "object":
        return JSON.stringify(value);
      default:
        throw new Error("Unsupported value type " + type);
    }
  };

  export const createMerkleTree = (leafHashes: string[]): any[] => {
    const tree = [leafHashes];
    let lowerLevel = leafHashes;

    while (lowerLevel.length > 1) {
      const newLevel = [];

      for (let i = 0; i < lowerLevel.length - 1; i = i + 2) {
        newLevel.push(hash(lowerLevel[i], lowerLevel[i + 1]));
      }

      tree.push(newLevel);

      lowerLevel =
        tree.length > 1 && lowerLevel.length % 2 != 0
          ? newLevel.concat(lowerLevel[lowerLevel.length - 1])
          : newLevel;
    }

    return tree;
  };

  export const hashSchema = (schema: string[]): string => {
    return hash(...schema);
  };

  export const createExtendedTreeRootHash = (
    merkleTreeRootHash: string,
    schema: string[]
  ): string => {
    return hash(merkleTreeRootHash, hashSchema(sortSchema(schema)));
  };

  export const createLeafs = (inputObject: any, salts?: string[]): Leaf[] => {
    const objectKeys = sortSchema(Object.keys(inputObject));

    if (salts && objectKeys.length !== salts.length) {
      throw new Error("Number of object keys and salts is not equal.");
    }

    return objectKeys.map((key, index) => {
      const canonizedValue = canonizeValue(inputObject[key]);
      const salt = salts ? salts[index] : getSalt(16);
      const hashValue = hash(key, canonizedValue, salt);

      return {
        key: key,
        value: canonizedValue,
        salt: salt,
        hash: hashValue
      };
    });
  };

  const createPath = (merkleTree: any[], leafToProof: Leaf): any[] => {
    const merkleTreePath = [];
    let currentHash = leafToProof.hash;
    let remainder = [];

    for (let i = 0; i < merkleTree.length - 1; i++) {
      const currentLevel: string[] = merkleTree[i].concat(remainder);
      const index = currentLevel.findIndex(hash => hash === currentHash);

      if (index + 1 < currentLevel.length || currentLevel.length % 2 === 0) {
        let pathElement;
        if (index % 2 === 0) {
          pathElement = currentLevel[index + 1];
          merkleTreePath.push({ right: pathElement });
        } else {
          pathElement = currentLevel[index - 1];
          merkleTreePath.push({ left: pathElement });
        }
        currentHash = merkleTree[i + 1][Math.floor(index / 2)];
      }
      remainder =
        currentLevel.length % 2 === 1
          ? [currentLevel[currentLevel.length - 1]]
          : [];
    }
    return merkleTreePath;
  };

  const findLeaf = (leafs: Leaf[], key: string) => {
    const leaf = leafs.find((l: Leaf) => l.key === key);
    if (!leaf) {
      throw new Error("Could not find leaf with the key " + key);
    }
    return leaf;
  };

  export const createProof = (
    key: string,
    leafs: Leaf[],
    withSchema: boolean,
    existingMerkleTree?: any[]
  ): Proof => {
    const sortedLeafs = sortLeafsByKey(leafs);
    const merkleTree = existingMerkleTree
      ? existingMerkleTree
      : createMerkleTree(sortedLeafs.map((leaf: Leaf) => leaf.hash));
    const leafToProve = findLeaf(sortedLeafs, key);

    const proof = {
      key: key,
      value: leafToProve.value,
      salt: leafToProve.salt,
      proofPath: createPath(merkleTree, leafToProve)
    };

    return withSchema
      ? {
          ...proof,
          schemaHash: hashSchema(sortedLeafs.map((leaf: Leaf) => leaf.key))
        }
      : proof;
  };

  const pathForPosition = (schemaLength: number, position: number) => {
    const positions = Array(schemaLength)
      .fill(null)
      .map((element, index) => ({
        key: index.toString(),
        value: null,
        salt: null,
        hash: hash(index.toString())
      }));

    const theLeaf = findLeaf(positions, position.toString());
    const merkleTree = createMerkleTree(
      positions.map((leaf: Leaf) => leaf.hash)
    );

    const path = createPath(merkleTree, theLeaf);
    let stringPath = "";
    path.forEach(element => {
      if (element.right) {
        stringPath = "0" + stringPath;
      } else if (element.left) {
        stringPath = "1" + stringPath;
      } else {
        throw new Error("Invalid proof path element");
      }
    });
    return parseInt(stringPath, 2);
  };

  export const verifyProof = (
    rootHash: string,
    proof: Proof,
    schema?: string[]
  ): boolean => {
    //TODO prevent duplicate keys in schema
    let currentHash = hash(proof.key, proof.value, proof.salt);
    let position = "";

    for (let i = 0; i < proof.proofPath.length; i++) {
      const currentPathElement = proof.proofPath[i];
      if (currentPathElement.right) {
        currentHash = hash(currentHash, currentPathElement.right);
        position = "0" + position;
      } else if (currentPathElement.left) {
        currentHash = hash(currentPathElement.left, currentHash);
        position = "1" + position;
      } else {
        throw new Error("Invalid proof path element");
      }
    }

    if (proof.schemaHash) {
      if (schema) {
        const sortedSchema = sortSchema(schema);
        const schemaIndex = sortedSchema.findIndex(
          (key: string) => key === proof.key
        );
        const extendedTreeRootHash = hash(
          currentHash,
          hashSchema(sortedSchema)
        );

        if (schema.length === 1) {
          return position === "" && extendedTreeRootHash === rootHash;
        }

        return (
          pathForPosition(schema.length, schemaIndex) ===
            parseInt(position, 2) && extendedTreeRootHash === rootHash
        );
      } else {
        throw new Error("Schema is needed for extended tree proof.");
      }
    } else {
      return currentHash === rootHash;
    }
  };
}
