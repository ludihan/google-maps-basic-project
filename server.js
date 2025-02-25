function getPort() {
    if (process.argv.length < 3) {
        console.error('Você precisa fornecer uma porta para esse script. Ex: 3000, 8080, etc.')
        process.exit(1)
    }
    const port = parseInt(process.argv[2])
    if (isNaN(port)) {
        console.error(`A porta fornecida não é um inteiro (${process.argv[2]})`)
        process.exit(1)
    }
    return port
}

const port = getPort()
const path = require('path')
const express = require('express')
const app = express()
const favicon = require('serve-favicon')

app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.get('/api', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Site disponível na porta ${port}`)
})
