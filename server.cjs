const express = require('express');
const bodyParser = require('body-parser');
const postgres = require('postgres');
require('dotenv').config();

const app = express();
const port = 3000;

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/submit', async (req, res) => {
  const { nome, turma, email } = req.body;

  try {
    await sql`
      INSERT INTO participantes (nome, turma, email)
      VALUES (${nome}, ${turma}, ${email})
    `;
    res.send('Dados inseridos com sucesso!');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao inserir dados');
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
