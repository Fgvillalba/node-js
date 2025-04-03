import fs from 'node:fs'

const text = await fs.readFile('./archivo.txt', 'utf-8', () => {})

console.log('Leyendo el archivo el primer archivo...')
console.log(text)

console.log('Haciendo algo mientras lee el archivo')

console.log('Leyendo el archivo el primer archivo...')
const secondText = await fs.readFile('./archivo2.txt', 'utf-8', () => {})
console.log(secondText)