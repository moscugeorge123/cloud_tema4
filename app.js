const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('index');
});

app.use(express.static(path.resolve(__dirname, 'public')));

app.listen(1337);
