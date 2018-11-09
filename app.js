const express = require('express');
const compression = require('compression');
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));

app.use(compression());

// assetse
app.use(express.static('public'));
app.use('/js/jquery', express.static('node_modules/jquery/dist'));
app.use('/css/normalize.css', express.static('node_modules/normalize.css'));

app.get('/', function(req, res) { 
   res.send(__dirname + '/' + 'index.html');
});