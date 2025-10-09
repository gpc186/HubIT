const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const registrarRoute = require('./middlewares/registrarUsuario');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.use('/api/registrar', registrarRoute);

app.get('/', (req, res)=>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/contact', (req, res)=>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'contact.html'));
});

app.listen(port, ()=>{
	console.log(`Server is up and listening on port: http://localhost:${port}.`);
})