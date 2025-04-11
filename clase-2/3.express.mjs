import express from 'express'
import { ditto } from './pokemon/ditto.mjs'

const app = express()

const PORT = process.env.PORT ?? 1234

//disable unused header information for security and performance
app.disable('x-powered-by')

//serve statics files, the route is the route of the file
//example :1234/cherry.jpg
app.use(express.static('./'))


app.use(express.json())
//middleware
// app.use((req, res, next) => {
//     if (req.method !== 'POST') return next()
//     if (req.headers['content-type'] !== 'application/json') return next()

//     let body = ''

//     req.on('data', (chunk) => {
//         body += chunk.toString();
//     })

//     req.on('end', () => {
//         const data = JSON.parse(body)
//         data.status = 'created'
//         req.body = data
//         console.log(req.body)
//         next()
//     })
// })


app.get('/', (req, res) => {
    //res.status(200).send('<h1>Mi api</h1>')
    res.json({ fede: 'Hola api' })
})

app.get('/pokemon/ditto', (req, res) => {
    res.json(ditto)
})

app.post('/pokemon', (req, res) => {
    res.status(201).json(req.body)
})

//if not match with any of the routes above(all methods)
app.use((req, res) => {
    res.status(404).send('<h1>404 not fouuund</h1>')
})

app.listen(PORT, () => {
    console.log(`server listening on port http://localhost:${PORT}`)
})