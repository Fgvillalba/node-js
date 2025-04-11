import http from 'node:http'

import { ditto } from './pokemon/ditto.mjs'

const processRequest = (req, res) => {
    const { method, url } = req
    switch (method) {
        case 'GET':
            switch (url) {
                case '/pokemon/ditto':
                    res.setHeader('Content-Type', 'application/json; charset=utf-8')
                    return res.end(JSON.stringify(ditto))
                default:
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    return res.end('<h1>404</h1>')
            }

        case 'POST':
            switch (url) {
                case '/pokemon': {
                    let body = ''

                    //listening data event
                    req.on('data', (chunk) => {
                        // eslint-disable-next-line
                        console.log(chunk.toString())
                        body += chunk.toString()
                    })
                    req.on('end', () => {
                        const data = JSON.parse(body)
                        res.writeHead(201, { 'Content-Type': 'application/json; charset=utf-8' })
                        //res.setHeader('Content-Type', 'application/json; charset=utf-8')
                        data.timestamp = Date.now()
                        res.end(JSON.stringify(data))

                    })
                    break;
                }
                default:
                    res.setHeader('Content-Type', 'text/html; charset=utf-8')
                    return res.end('<h1>404 not founds</h1>')
            }
    }

}

const server = http.createServer(processRequest)

server.listen('1234', () => {
    console.log(`server listening on port http://localhost:1234`)
})