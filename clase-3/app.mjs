import express from 'express'

const app = express()
const port = process.env.PORT ?? 1234
app.disable('x-powered-by')

app.get('/', (req, res) => {
    res.json({ message: 'Hello there' })
})

app.listen(port, () => {
    console.log(`server listening on port ${port}`)
})