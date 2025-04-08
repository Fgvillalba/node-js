import { readdirSync } from "fs";
import { join, extname, basename } from 'node:path'
import fs from 'node:fs/promises'

const folderPath = 'files'

let filesPath = readdirSync(folderPath, 'utf-8')

const aReadFilesPromises = filesPath.map((path) => {
    return fs.readFile(join(folderPath,path), 'utf-8')
})

Promise.all(aReadFilesPromises).then((files) => {
    files.forEach((file, idx) =>  {
        const filename = filesPath[idx]
        const ext = extname(filename)
        console.log(`${basename(filename, ext)}: `, file)
    })
})
