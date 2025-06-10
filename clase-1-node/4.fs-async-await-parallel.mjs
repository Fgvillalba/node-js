import readFile from 'node:fs/promises'


Promise.all([
    readFile.readFile('./archivo.txt', 'utf-8'),
    readFile.readFile('./archivo2.txt', 'utf-8')
]).then(([text, secondText]) => {
    console.log("primer texto:" ,text)
    console.log("segundo texto:", secondText)
})


// (async() => {
//     console.log('Leyendo el primer archivo...')
//     const firstText = await 
//     console.log("primer texto:" ,firstText)  

//     console.log('Haciendo algo mientras lee el archivo')

//     console.log('Leyendo el segundo archivo...')
//     const secondtText = await 
//     console.log("segundo texto:" ,secondtText)
// })()
