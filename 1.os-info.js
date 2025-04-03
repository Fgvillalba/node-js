const os = require('node:os')

console.log('Informacion del sistema operativo:')
console.log('--------------------------')

console.log('Nombre del so', os.platform())
console.log('Version del so', os.release())
console.log(os.freemem() / 1024 / 1024 / 1024)
console.log(os.totalmem() / 1024 / 1024 / 1024)
console.log(os.uptime() / 60 / 60 / 24)