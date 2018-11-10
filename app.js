const express = require('express');
const compression = require('compression');
const app = express();
const port = 3000;

const server = app.listen(port, () => console.log(`App listening on port ${port}!`));

app.use(compression());

// assetse
app.use(express.static('public'));
app.use('/js', express.static('node_modules/jquery/dist'));
app.use('/js/modal', express.static('node_modules/vanilla-modal/dist'));
app.use('/css', express.static('node_modules/normalize.css'));

app.get('/', function(req, res) { 
   res.send(__dirname + '/' + 'index.html');
});