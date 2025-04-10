import net from 'node:net'


export function findAvailablePort(desiredPort) {
    return new Promise((resolve, reject) => {
        const server = net.createServer()

        server.listen(desiredPort, () => {
            const port = server.address().port
            server.close(() => {
                resolve(port)
            })
        })

        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                findAvailablePort(0).then(resolve)
            } else {
                reject(err)
            }
        })
    })
}