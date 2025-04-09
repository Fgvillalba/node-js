import fs from'node:fs/promises'
import { join } from 'node:path'
import pc from 'picocolors'

const folder = process.argv[2] ?? '.'


function colorBySize(size){
  let color;
  switch(true){
    case size < 500:
      color = "green";
      break;
    case size < 1000:
      color = "yellow";
      break;
    default:
      color = "red"; 
      break;
  }
  return pc[color](size.toString().padStart(10))
}

async function ls(folder){
    let files
    try {
        files = await fs.readdir(folder)
    } catch(e) {
        console.log(pc.red(`❌ No se pudo leer el directorio ${folder}`))
        process.exit(1)
    }
    
    const filesPromises = files.map(async file => {
      const filePath = join(folder, file)
      let stats
      try{
        stats = await fs.stat(filePath)
      } catch(e){
        console.log(pc.red(`❌ Error al obtener información del archivo: ${file}`))
        process.exit(1)
      }

      const isDirectory = stats.isDirectory()
      const fileType = isDirectory ? 'd' : '-'
      const fileSize = stats.size
      const fileModified = stats.mtime.toLocaleString()

      // return ` ${pc.white(fileType)} ${pc.blue(file.padEnd(30))} ${pc.green(fileSize.toString().padStart(10))} ${pc.yellow(fileModified)}` 
      return ` ${pc.white(fileType)} ${pc.blue(file.padEnd(30))} ${colorBySize(fileSize)} ${pc.cyan(fileModified)}` 
    })

    const filesInfo = await Promise.all(filesPromises)
    filesInfo.forEach(fileInfo => console.log(fileInfo))
}

ls(folder)

