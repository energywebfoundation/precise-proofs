"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const web3 = require("web3");
exports.demoinput = {
    operationalSince: 0,
    capacityWh: 10,
    country: "Germany",
    region: "Saxony",
    active: true,
    nestedObject: {
        id: 1,
        somedata: "hello",
        ObjectInObjectInObject: {
            id: 2,
            somedata: "there"
        }
    },
    zip: "09648",
    city: "Mittweida",
    street: "Main Street",
    houseNumber: "101",
    gpsLatitude: "50.986783",
    gpsLongitude: "12.980977",
    listElement: [1, 3, 3]
};
const rpcEndpoint = "http://localhost:8545";
exports.malignDemoinput = {
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
};
function grabRegistry(address = "0x535ea027738590b1ad2521659f67fb25b08dd5ee") {
    const w3 = new web3(rpcEndpoint);
    const registryJSONString = fs.readFileSync(path.join(__dirname, "../../../build/contracts/PreciseProofCommitmentRegistry.json"), "utf-8");
    const registryJSON = JSON.parse(registryJSONString);
    //const registrycontract = new web3.eth.Contract(registryJSON.abi, "0x535ea027738590b1ad2521659f67fb25b08dd5ee");
    return new w3.eth.Contract(registryJSON.abi, address);
}
exports.grabRegistry = grabRegistry;
function newCommitment(name, treeHash, schema, transaction) {
    // We publish the roothash and schema
    const registrycontract = grabRegistry();
    const schemaString = JSON.stringify(schema);
    return registrycontract.methods.commitment(name, treeHash, schemaString).send(transaction);
}
exports.newCommitment = newCommitment;
function localAccounts() {
    const w3 = new web3(rpcEndpoint);
    return w3.eth.getAccounts();
}
exports.localAccounts = localAccounts;
function getCommitment(address, name) {
    return __awaiter(this, void 0, void 0, function* () {
        const registrycontract = grabRegistry();
        let result = yield registrycontract.methods.getCommitment(address, name).call();
        return {
            merkleRoot: result[0],
            schema: parseSchema(result[1])
        };
    });
}
exports.getCommitment = getCommitment;
function parseSchema(schemaString) {
    return JSON.parse(schemaString);
}
exports.parseSchema = parseSchema;
//# sourceMappingURL=demoutils.js.map