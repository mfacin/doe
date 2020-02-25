require('dotenv/config')

// importação das dependencias
const express = require('express')
const server = express()
const Pool = require('pg').Pool
const nunjucks = require('nunjucks')

// configura o server para apresentar arquivos estáticos
server.use(express.static('public'))

// habilitar body do formulário
server.use(express.urlencoded({ extended: true }))

// configurar banco de dados
const db = new Pool({
    user: process.env.DB_NAME,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database:process.env.DB_DTBS
})

// configura a template engine
nunjucks.configure('./', {
    express: server,
    noCache: true
})

// renderizando a página
server.get('/', (req, res) => {
    // prepara a query
    const query = 'SELECT name, blood FROM donors'

    // pesquisa os dados no banco de dados
    db.query(query, (err, result) => {
        // verifica se houve algum erro
        if (err) return res.status(500).send('erro no banco de dados\n' + err)

        // pega os dados 
        const donors = result.rows

        // renderiza a página
        return res.status(200).render('index.html', { donors })
    })
})

// recebendo os dados do formulário
server.post('/', (req, res) => {
    // pegar dados do formulário
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    // verificando se as variáveis não estão vazias
    if (!name || !email || !blood) 
        return res.status(400).send('todos os campos são obrigatórios')

    // prepara a query e os valores
    const query = 'INSERT INTO donors ("name", "email", "blood") VALUES ($1, $2, $3);'
    const values = [name, email, blood]

    // insere os valores no banco
    db.query(query, values, err => {
        // verifica se houve algum erro
        if (err) return res.status(500).send('erro no banco de dados\n' + err)

        // redireciona para a página inicial
        return res.redirect('/')
    })
})

const port = process.env.PORT

// escuta a porta 3000
server.listen(port, () => console.log(`> Server running on port ${port}`))