// Coração do servidor
// Importado express, path, rotas
const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const registrarRoute = require('./middlewares/registrarUsuario');
const loginRoute = require('./middlewares/logarUsuario');
const userData = require('./middlewares/usuario');
const empregosRoute = require('./middlewares/emprego');
const portfoliosRoute = require('./middlewares/portfolio');
const curriculosRoute = require('./middlewares/curriculo');
const candidaturasRoute = require('./middlewares/candidatura');

// Ativa requisitos para funcionamento de json e path
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// Ativa a utilização das rotas dadas
app.use('/api/registrar', registrarRoute);
app.use('/api/login', loginRoute);
app.use('/api/usuario', userData);
app.use('/api/emprego', empregosRoute);
app.use('/api/portfolio', portfoliosRoute);
app.use('/api/curriculo', curriculosRoute);
app.use('/api/candidatura', candidaturasRoute)

// Página Inicial que pega login.html
app.get('/', (req, res)=>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Página Contato que pega contact.html
app.get('/contact', (req, res)=>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Página Perfil que pega pagina-de-perfil.html
app.get('/perfil/:id', (req, res)=>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'pagina-de-perfil.html'));
});

app.get('/home', (req, res) =>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'principal.html'));
});

app.get('/portfolio', (req, res) =>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'portfolio.html'));
});

app.use((req, res) => {
	res.status(404).sendFile(path.join(__dirname, 'public', '404.html'))
})

// Servidor rodando
app.listen(port, ()=>{
	console.log(`Server is up and listening on port: http://localhost:${port}.`);
})