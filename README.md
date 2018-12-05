# precise-proofs
JSON: 
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