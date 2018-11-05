const express = require('express');
const app = express();
const port = 3000;
const server = app.listen(port, () => console.log(`App listening on port ${port}!`));

app.use(express.static('public'));

app.get('/', function(req, res) { 
   res.send(__dirname + '/' + 'index.html');
});