const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');
const e = require('express');


app.use(bodyParser.json());

// Get Method For Students 
Router.get('/Student/GetBooked', (req, res, next) => {
    if (Object.keys(req.query).length == 0) {
        res.send({
            error: true,
            code: "C001_GET",
            message: "query parameters were not found"
        });
        return
    }

    if (req.query.id) {
        
            mariadb.query('SELECT `Busid`,`Studentid`,`From`,`To`,`Status`,`Temporally`,TIME_FORMAT(Time, "%H:%i") AS Time,`Date` FROM Bus WHERE Studentid = '+req.query.id+'', (err, rows) => {
                if (!err) {
                    res.send({
                        error: false,
                        data: rows
                    });
                } else {
                    res.send({
                        error: true,
                        code: "C001_SQL_GET",
                        message: err
                    });
                    return
                }
            })
        
    } else {
        res.send({
            error: true,
            code: "C002_GET",
            message: "Id was not recieved from body arguements"
        });
        return
    }
});




module.exports = Router;