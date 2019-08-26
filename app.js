const express = require('express');
const mysql = require('mysql');
const app = express();

const conn = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "",
    database: "realestate"
});

app.use(express.static("public"));
app.set("view engine", "pug");
app.set("views", "./views");

app.get('/:suburb?/:page?', (req, res) => {

    let suburb = req.params.suburb;
    let page = req.params.page || 1;
    let limit = 12;
    let offset;

    if (page === 1) {
        offset = 1;
    }
    else {
        offset = (page - 1) * limit + 1;
    }

    let sqlSuburbs = "SELECT DISTINCT suburb FROM properties ORDER BY suburb";
    let sqlProperties = "SELECT * FROM properties WHERE suburb = ?";
    let sqlCount = "SELECT COUNT(*) AS 'count' FROM properties WHERE suburb = ?";
    let placeholders = [suburb, limit, offset];
    let suburbPlaceholder = [suburb];

    if (+suburb === parseInt(suburb)) {
        page = suburb;
        suburb = "";
        offset = (page - 1) * limit + 1;
        sqlProperties = "SELECT * FROM properties";
        placeholders = [limit, offset];
        sqlCount = "SELECT COUNT (*) AS 'count' FROM properties ORDER BY ?";
        suburbPlaceholder = [suburb];
    }

    if (suburb === undefined) {
        sqlProperties = "SELECT * FROM properties";
        sqlCount = "SELECT COUNT (*) AS 'count' FROM properties ORDER BY ?";
        placeholders = [limit, offset];
        suburbPlaceholder = ['suburb'];
        suburb = "";
    }

    conn.query(sqlSuburbs, (err, subrub_result) => {
        //Get Properties
        conn.query(sqlProperties + " LIMIT ? OFFSET ?", placeholders, (err, properties_result) => {
            //Get Record Count
            conn.query(sqlCount, suburbPlaceholder, (err, record_count) => {
                // render the page
                res.render('index', {
                    title: "Home",
                    suburbs: subrub_result,
                    properties: properties_result,
                    currentPage: page,
                    totalPages: Math.ceil(record_count[0].count / limit),
                    suburb: suburb
                });
            });
        });
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