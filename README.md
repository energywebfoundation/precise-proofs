# Origin project's proof-of-concept Precise Proof implementation

This is a [Node JS package]() and some demo scripts for getting started with Precise Proofs.

This is still a **proof-of-concept (poc)** implementation, which should not be used in production, or be used with common sense. We are not responsible for loss of money or exposure of sensitive data.

## What are precise proofs?
Precise Proofs is a "privacy technique" based on Merkle trees to prove that some revealed parts of your document belong to the whole document without revealing other sensitive data. This technique is used in one of Energy Web Foundation’s project called [Certificates of Origin](https://energyweb.org/origin/).
For more information on Precise Proofs, please refer to [EnergyWeb's Privacy wiki page](https://energyweb.atlassian.net/wiki/spaces/EWF/pages/610992129/Privacy+solutions+overview).

This implementation was inspired by [Centrifuge's Precise Proofs implementation in Go](https://github.com/centrifuge/precise-proofs). In our version we emphasized improved security by:
 - making the leaf positions matter in the tree
 - adding the hash of the document schema to the tree as well

to prevent injection/duplicate key attacks and the prover to create phony proofs.

## What do you find here?
 - A small npm package to create and verify proofs yourself
 - Examples (demos), which demonstrate the capabilities and possible vulnerabilities too (for educative purposes)

## Maintainers
**Primary**: Adam Nagy (@ngyam)

Heiko Burkhardt (@hai-ko), who did the heavy lifting to create this poc.

## Quickstart

In your project:
```bash
npm install precise-proofs-js
```

Then in a JS project:
```javascript

const PreciseProofs = require("precise-proofs-js");
[...]

```
Or in a Typescript project:
```javascript
import * as PreciseProofs from "precise-proofs-js"
[...]
```
Unfortunately the code is not documented. For examples look into the **demo files** or read the good source. They are quite intuitive though.

## Demos

After cloning the repo and installing dependencies, you can run the demo scripts with ```npm run demoX```, where X should be replaced by the number of the demo you are interested in.

### Demo 1
Simple proof generation and successful verification example which does not include the schema hash.
### Demo 2
Simple proof generation with a bad proof and failed verification
### Demo 3
Demonstration of an identical key attack in the case you are not including the schema hash.

Lesson: you have to include the schema.
### Demo 4
Demonstration that the prover can literally create any phony merkle roots and proofs if the schema hash is not included.

Lesson: again, you have to include the schema.
### Demo 5
Extended proof generation and successful verification example which includes the schema hash.
### Demo 6
How an identical key attack looks like if you include the schema hash.

Lesson: if you see a published commitment & schema with 2 identical keys, you should not trust any proof for that. In the poc implementation, a duplicate key attack is only possible for the key **first in the "abc" order**, otherwise the verification simply fails (leaf position matters).

### Demo 7
Publishing the merkle root / schema as a commitment to Smart Contract, which the verifier can interact with.
 1. Prover publishes its commitment on-chain to a registry-like smart contract
 2. Prover creates a proof
 3. Prover sends the proof off-chain to the verifier
 4. Verifier reads the commitment on-chain and verifies the proof off-chain

## Contributing

Please read [contributing](./CONTRIBUTING.md) and our [code of conduct](./CODE_OF_CONDUCT.md) for details.

## Getting started

### Prerequisites

 - node, npm
 - Truffle, if you want to deploy Smart Contracts

### Installing the deps

```bash
git clone https://github.com/energywebfoundation/precise-proofs.git
cd precise-proofs
npm install -D
```

## Running the tests

```bash
npm test
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. Version number is bumped with `bumpversion` tool.

## License

This project is licensed under GPLv3 - see the [LICENSE](./LICENSE) file for details.

## Limitatins of this poc
 - Not optimized for efficieny/saving space/gas
 - Proof format is not as generic as [Centrifuge's protobuf one](https://github.com/centrifuge/precise-proofs/blob/master/proofs/proto/proof.proto)
 - Nested objects / arrays are flattened out as a big string (minimal support)
 - You can generate a proof for one revealed field at a time
 - Duplicate keys are not prohibited in the schema
 - Only JS implementation so far

## Output examples

A document (JSON): 
```
{ operationalSince: 0,
  capacityWh: 10,
  country: 'Germany',
  region: 'Saxony',
  active: true,
  nestedObject: {
    id: 1 },
  zip: '09648',
  city: 'Mittweida',
  street: 'Main Street',
  houseNumber: '101',
  gpsLatitude: '0',
  gpsLongitude: '0' }
```
Leafs:
```
[ { key: 'region',
    value: 'Saxony',
    salt: 'aj0hPzUj1dsAz2vB',
    hash:
     '187905b76121dcc69b92528c06bdf0488fb8f3c518cd92b279f7b37d1e16d709' },
  { key: 'gpsLongitude',
    value: '0',
    salt: 'k5JvqfiX3wThba9l',
    hash:
     '98a42887ea117ee032fb925643749d175167e5ebf751c2592e580dcf739f5f89' },
...]
```

Extended Merkle Tree:

![Tree](doc-assets/tree.png "Tree")

Proof: 
```
{ key: 'street',
  value: 'Main Street',
  salt: 'EU1rw9ZpD9DwcRRU',
  proofPath:
   [ { left:
        '710b9f14ac3a5c84b1d91b71707f6afed596e608d335847faed0ca2d4b5e71a1' },
     { right:
        '7a6d8e0106e10c2d5ae07c559d859092be703ff0ee43d5b7c95f66f6b9116976' },
     { left:
        'b632f8f9ade851a0748bdd0038f253bbfda967f0c83cd1500ede2183e98742e3' },
     { right:
        '72114321d2844700bda3dff640045d54aae27abfdc792b66134ae67437c9c8bb' } ] }
```
