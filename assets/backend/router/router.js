const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/', (req, asw)=>{
	res.status(200).sendFile(path.join(__dirname, 'public', 'login.html'));
})

app.listen(port, ()=>{
	console.log(`Server is up and listening on port: ${port}`);
})