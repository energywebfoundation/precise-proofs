import { ethers } from 'ethers'
import { PreciseProofCommitmentRegistryFactory } from '../ethers/PreciseProofCommitmentRegistryFactory'
import { BigNumber, bigNumberify } from 'ethers/utils'

interface Transaction {
    from: string
} 

interface IOwnershipCommitment {
    [address: string]: BigNumber;
}

export const demoinput: IOwnershipCommitment = {
    '0x5B1B89A48C1fB9b6ef7Fb77C453F2aAF4b156d45': bigNumberify(100)
}

const rpcEndpoint = "http://localhost:8545"

export const malignDemoinput = {
    here: 9898,
    is: 1000,
    a: "Mars",
    little: "YouDunGoofed",
    lesson: true,
    in: {
        fact: "Disney Star Wars is bad :("
    },
    trickery: "09648",
    street: "Main Street",
    whatever: "x",
    you: 1,
    can: ["never", "gonne", "give", "you", "up"],
    write: "lol",
    important: "https://www.youtube.com/watch?v=oHg5SJYRHA0"
}

export function grabRegistry(address="0x535ea027738590b1ad2521659f67fb25b08dd5ee") {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
    return PreciseProofCommitmentRegistryFactory.connect(address, provider);
}

export function newCommitment(name: string, treeHash: string, schema: any[], transaction: Transaction) {
    // We publish the roothash and schema
    const registrycontract = grabRegistry();
    const schemaString = JSON.stringify(schema);
    return registrycontract.methods.commitment(name, treeHash, schemaString).send(transaction);
}

export function localAccounts() {
    const provider = new ethers.providers.JsonRpcProvider(rpcEndpoint);
    return provider.listAccounts();
}

export async function getCommitment(address: string, name: string) {
    const registrycontract = grabRegistry();
    const result = await registrycontract.methods.getCommitment(address, name).call();
    console.log(result);
    return {
        merkleRoot: result[0],
        schema: parseSchema(result[1])
    }
}

export function parseSchema(schemaString: string) {
    return JSON.parse(schemaString);
}
