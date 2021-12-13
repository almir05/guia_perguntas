const express = require('express');
const app = express();
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');

connection
  .authenticate()
  .then(() => {
    console.log('Conexão feita com o banco de dados')
  })
  .catch(msgErro => {
    console.log(msgErro)
  });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.get('/', (req, res) => {
  Pergunta.findAll({ raw: true, order: [
    ['id', 'DESC']
  ] }).then(perguntas => {
    res.render('index', {
      perguntas
    });
  });
});

app.get('/perguntar', (req, res) => {
  res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {
  let titulo = req.body.titulo;
  let descricao = req.body.descricao;

  Pergunta.create({
    titulo,
    descricao
  }).then(() => {
    res.redirect('/');
  });
});

app.get('/pergunta/:id', (req, res) => {
  let id = req.params.id;

  Pergunta.findOne({
    where: { id }
  }).then(pergunta => {
    if (pergunta != undefined) {
      res.render('pergunta');
    } else {
      res.redirect('/');
    }
  });
});

app.listen(8080, () => console.log('App rodando'));