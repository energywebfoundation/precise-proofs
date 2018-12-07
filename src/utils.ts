import * as Treeify from 'treeify'
import * as Colors from 'colors/safe'
import {PreciseProofs} from '.' 

export const printMerkleTree = (merkleTree: any[], leafs: PreciseProofs.Leaf[], schema?: string[]) => {

    let resultObject  = {}

    let row
    let lowerLevel = merkleTree[0]
    let remainder = [] 
    const merkleTreeRootHash = merkleTree[merkleTree.length-1][0]

    for(let i = 1; i < merkleTree.length; i++ ) {

        row = merkleTree[i]

        lowerLevel = i != 1 && lowerLevel.length % 2 !== 0 ? merkleTree[i-1].concat(lowerLevel[lowerLevel.length - 1]) : merkleTree[i-1]

        const line = {}

        for(let j = 0; j < row.length; j++ ) {
            const hash = row[j]
            const left = lowerLevel[j * 2]
            const right = lowerLevel[j * 2 + 1]

            let newNode = {
                
                [lowerLevel[j * 2]]: i === 1 ?
                    null : 
                    remainder[left] ?
                        remainder[left] :
                        {...resultObject[left]},
                [lowerLevel[j * 2 + 1]]: i === 1 ? 
                    null :
                    remainder[right] ?
                        remainder[right] :
                        {...resultObject[right]}
            }
            remainder[hash] = newNode
        
            line[hash] = newNode
            
        }

        resultObject = line

    }

    const schemaHash = schema ? PreciseProofs.hashSchema(PreciseProofs.sortSchema(schema)) : null

    

    resultObject = schema ? { 
        [PreciseProofs.createExtendedTreeRootHash(merkleTreeRootHash, schema)]: {
            ...resultObject,
            [schemaHash]: null
        } 
    } : resultObject
        
    let leafCounter = 0

    console.log('\n- Tree View\n')
    Treeify.asLines(resultObject, true, (data: string) => {
        const hashLength = 64
        if (leafs) {
            
            
            const leadingSpaces = data.length - data.trim().length
            
            const leaf = leafs.find((leaf: PreciseProofs.Leaf) => 
                leaf.hash === data.substring(data.length - hashLength, data.length)
            )
            const theHash = data.substring(data.length - hashLength, data.length)
            const shortHash = theHash.substring(0, 4) + '...' + theHash.substring(theHash.length - 4, theHash.length)
            
            
            
            if (leadingSpaces === 0 && theHash !== merkleTreeRootHash) {
                console.log(
                    data.substring(0, data.length - hashLength ) +
                    Colors.underline(Colors.yellow(shortHash)) +
                    Colors.yellow(' Extended Tree Root') )
            } else if (theHash === merkleTreeRootHash) {
                console.log(
                    data.substring(0, data.length - hashLength ) +
                    Colors.underline(Colors.cyan(shortHash)) +
                    Colors.cyan(' Merkle Tree Root') )
            } else if (leaf) {
                console.log(
                    data.substring(0, data.length - hashLength) +
                    Colors.underline(Colors.green(shortHash)) + ' ' +
                    Colors.green(`[${leafCounter++}] `) +
                    Colors.grey(leaf.key + ': ' + leaf.value + ' (salt: ' + leaf.salt + ')')
                ) 
            } else if (theHash === schemaHash) {
                
                console.log(
                    data.substring(0, data.length - hashLength) +
                    Colors.underline(Colors.blue(shortHash)) + Colors.blue(' Schema'))

                schema.forEach((element: string, index: number) => {
                    console.log(Colors.grey(`      [${index}] ${element}`))
                })
                console.log() 
            } else {
          
                console.log(
                    data.substring(0, data.length - hashLength) +
                    Colors.underline(shortHash))
            }

        } else {
            console.log(
                data.substring(0, data.length - hashLength) +
                data.substring(data.length - hashLength, data.length))
        }
        
        
    })

}