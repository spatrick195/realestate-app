const express = require('express');
const app = express();

app.use(express.static("public"));

app.set("view engine", "pug");
app.set("views", "./views");

app.get('/', (req, res) => {
    res.render("index", {
        title: 'Home Page'
    });
});

app.get('/about', (req, res) => {
    res.render("about", {
        title: 'About Page'
    });
});

app.listen(3000, () => {
    console.log('Running on port 3000...');
});