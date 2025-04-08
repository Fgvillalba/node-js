import fs from'node:fs/promises'
import { join } from 'node:path'

const folder = process.argv[2] ?? '.'

async function ls(folder){
    let files
    try {
        files = await fs.readdir(folder)
    } catch(e) {
        console.log(`No se pudo leer el directorio ${folder}`)
        process.exit(1)
    }
    
    const filesPromises = files.map(async file => {
      const filePath = join(folder, file)
      let stats
      try{
        stats = await fs.stat(filePath)
      } catch(e){
        console.log(`Error al obtener información del archivo: ${file}`)
        process.exit(1)
      }

      const isDirectory = stats.isDirectory()
      const fileType = isDirectory ? 'd' : '-'
      const fileSize = stats.size
      const fileModified = stats.mtime.toLocaleString()

      return `${fileType} ${file.padEnd(30)} ${fileSize.toString().padStart(10)} ${fileModified}` 
    })

    const filesInfo = await Promise.all(filesPromises)
    filesInfo.forEach(fileInfo => console.log(fileInfo))
}

ls(folder)

