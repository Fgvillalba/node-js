import http from 'node:http'
import { findAvailablePort } from './10.free-port.mjs'

// const desiredPort = process.argv[2] ?? 3000

const server = http.createServer((req, res) => {
    console.log('request received')
    res.end('Te respondi')
})

findAvailablePort(desiredPort).then((port) => {
    server.listen(port, () => {
        console.log(`server listening on port http://localhost:${server.address().port}`)
    })
})

