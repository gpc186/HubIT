const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static('assets'));

app.get('/', (req, asw)=>{
	asw.status(200).sendFile(path.join(__dirname, 'public', 'login.html'));
})

app.listen(port, ()=>{
	console.log(`Server is up and listening on port: ${port}`);
})