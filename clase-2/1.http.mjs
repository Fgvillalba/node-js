import http from 'node:http'
import fs from 'node:fs'

const desiredPort = process.env.PORT ?? 1234

const processRequest = (req, res) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    if (req.url === '/') {
        res.statusCode = 200
        res.end('<h1>Bienvenido a esta página 3</h1>')
    } else if (req.url === '/imagen') {
        fs.readFile('./cherry.jpg', (err, data) => {
            if (err) {
                res.statusCode = 500
                res.end('<h1>Algo malio sal</h1>')
            } else {
                res.setHeader('Content-Type', 'image/jpg')
                res.end(data)
            }
        })
    } else if (req.url === '/contacto') {
        res.statusCode = 200
        res.end('<h1>Contactos</h1>')
    } else {
        res.statusCode = 404
        res.end('<h1>404</h1>')
    }
}

const server = http.createServer(processRequest)

server.listen(desiredPort, () => {
    console.log(`server listening on port http://localhost:${server.address().port}`)
})

