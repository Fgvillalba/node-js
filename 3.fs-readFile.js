import fs, { read } from 'node:fs'
//utilize with native modules without promise mode
// import { promisify } from 'node:util'

// const readFilePromised = promisify(fs.readFile)

console.log('Leyendo el primer archivo...')
fs.readFile('./archivo.txt', 'utf-8', (err, text) => {
    console.log("primer texto:" ,text)
})

// const text = await readFilePromised('./archivo.txt', 'utf-8')
// console.log("primer texto:", text)

console.log('Haciendo algo mientras lee el archivo')


console.log('Leyendo el segundo archivo...')
fs.readFile('./archivo2.txt', 'utf-8', (err, text) => {
    console.log("segundo texto:" ,text)
})
