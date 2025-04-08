//const fs = require('node:fs')
//const fs = require('node:fs/promises')
import fs from 'node:fs/promises'

// fs.readdir('.', (err, files) => {
//     if(err) {
//         console.log('Error al leer el directorio', err)
//         return 
//     }
     
//     files.forEach(file => {
//         console.log(file)
//     })
// })

// fs.readdir('.sdasd')
//     .then(files => {
//         files.forEach(file => {
//             console.log(file)
//         })
//     })
//     .catch(err => {
//         console.log('Error al leer el directorio', err)
//     })


try {
    const files = await fs.readdir('.')
    files.forEach(file => console.log(file))
} catch (e) {
   console.log('Error al leer el directorio', e)
}

console.log('ejectuo codigo')