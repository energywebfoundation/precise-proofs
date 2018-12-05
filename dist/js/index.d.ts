export declare namespace PreciseProofs {
    const printTree: (merkleTree: any[], leafs: Leaf[], schema?: string[]) => void;
    interface Leaf {
        key: string;
        value: string;
        salt: string;
        hash: string;
    }
    interface Proof {
        key: string;
        value: string;
        salt: string;
        schemaHash?: string;
        proofPath: any[];
    }
    const hash: (input: string) => string;
    const sortLeafsByKey: (leafs: Leaf[]) => Leaf[];
    const canonizeValue: (value: any) => string;
    const createMerkleTree: (leafHashs: string[]) => any[];
    const hashSchema: (schema: string[]) => string;
    const createExtendedTreeRootHash: (merkleTreeRootHash: string, schema: string[]) => string;
    const createLeafs: (inputObject: any, salts?: string[]) => Leaf[];
    const createProof: (key: string, leafs: Leaf[], withSchema: boolean, existingMerkleTree?: any[]) => Proof;
    const verifyProof: (rootHash: string, proof: Proof, schema?: string[]) => boolean;
}
