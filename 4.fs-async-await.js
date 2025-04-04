import readFile from 'node:fs/promises'


//IIFE - Inmediatly invoked function expression
(async() => {
    console.log('Leyendo el primer archivo...')
    const firstText = await readFile.readFile('./archivo.txt', 'utf-8')
    console.log("primer texto:" ,firstText)  

    console.log('Haciendo algo mientras lee el archivo')

    console.log('Leyendo el segundo archivo...')
    const secondtText = await readFile.readFile('./archivo2.txt', 'utf-8')
    console.log("segundo texto:" ,secondtText)
})()




