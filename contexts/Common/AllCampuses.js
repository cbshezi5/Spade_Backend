const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');
const e = require('express');


app.use(bodyParser.json());

// Get Method For Students 
Router.get('/', (req, res, next) => {      
            mariadb.query(`SELECT DISTINCT * from Campus`, (err, rows) => {
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
        
});


Router.put('/',(req,res,next)=>{
    
    mariadb.query(`SELECT * FROM Student WHERE StudentNumber = "${req.body.stNumber}"`, (err, rows) => {
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

})

Router.post('/',(req,res,next)=>{
    
    mariadb.query(`SELECT * FROM Bus WHERE Studentid = "${req.body.stid}"`, (err, rows) => {
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

})

module.exports = Router