import { readdirSync } from "fs";
import fs from 'node:fs/promises'

const folderPath = './files'

let filesPath = readdirSync(folderPath, 'utf-8')

// function readFilePromise(path){
//     return readFile(path, 'utf-8')
// }

const aReadFilesPromises = filesPath.map((path) => {
    return fs.readFile(`${folderPath}/${path}`, 'utf-8')
})

Promise.all(aReadFilesPromises).then((files) => {
    files.forEach((file, idx) => console.log(`${filesPath[idx]}:`,file))
})



//console.log(files)