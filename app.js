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

    if (page == 1) {
        offset = 1;
    } else {
        offset = (page - 1) * limit + 1;
    }

    let sqlSuburbs = "SELECT DISTINCT suburb FROM properties ORDER BY suburb";
    let sqlProperties = "SELECT * FROM WHERE suburb = ?";
    let sqlCountPlaceholder = [suburb];
    let sqlCount = "SELECT COUNT(*) AS 'count' FROM properties WHERE suburb = ?";
    let placeholders = [suburb, limit, offset];

    if (+suburb == parseInt(suburb)) {
        page = suburb;
        suburb = "";
        offset = (page - 1) * limit + 1;
        sqlProperties = "SELECT * FROM properties";
        placeholders = [limit, offset];
        sqlCount = "SELECT COUNT(*) AS 'count' FROM properties ORDER BY ?";
        sqlCountPlaceholder = [suburb];
    }

    else if (suburb === undefined) {
        sqlProperties = "SELECT * FROM properties";
        sqlCount = "SELECT COUNT(*) AS 'count' FROM properties ORDER BY ?";
        placeholders = [limit, offset];
        sqlCountPlaceholder = ['suburb'];
        suburb = "";
    }
    else {
        sqlProperties = "SELECT * FROM properties where suburb = '" + suburb + "'";
        sqlCount = "SELECT COUNT(*) AS 'count' FROM properties where suburb = '" + suburb + "' ORDER BY ?";
        placeholders = [limit, offset];
        sqlCountPlaceholder = [suburb];
    }

    conn.query(sqlSuburbs, (err, suburb_result) => {
        if (err) throw err
        // Get the properties
        conn.query(sqlProperties + " LIMIT ? OFFSET ?", placeholders, (err, properties_result) => {
            if (err) throw err
            // Get the query record count
            conn.query(sqlCount, sqlCountPlaceholder, (err, record_count) => {
                var totalPages = Math.ceil(record_count[0].count / limit);
                if (err) throw err
                //Display the page and provide it with values
                res.render("index", {
                    title: 'Home Page',
                    suburbs: suburb_result,
                    properties: properties_result,
                    currentPage: page,
                    // set next property to a ternary statement that increases/decreases page value
                    next: page + 1 > totalPages ? totalPages : page + 1,
                    prev: page - 1 >= 1 ? page - 1 : 1,
                    totalPages: totalPages,
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