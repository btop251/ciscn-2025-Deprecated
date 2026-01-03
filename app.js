const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const routes = require('./routes');
const nunjucks = require('nunjucks');

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
app.set('views','./views');

app.use(routes);
app.use(express.static('public'));

app.all('*', (req, res) => {
    return res.status(404).send('404 page not found');
});

app.listen(8080, () => console.log('Listening on port 8080'));
