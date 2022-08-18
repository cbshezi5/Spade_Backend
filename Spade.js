//Module Importing
const express = require('express');
//const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');


//Student
const Campus_cnxt = require('./UserVoxi')


app.use(bodyParser.json());

app.use(function(req, res, next) {
    //Header allowences of METHODS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

//context channelling Student
app.use('/VoxiUserAdd',Campus_cnxt)


const PORT = 1100

var server = app.listen(process.env.PORT || PORT, (e) => {
    console.log("********************************************************");
    console.log("* DB: localhost:3306 DBname:'buspoint_db_schema'       *");
    console.log("*                PORT is running on " + process.env.PORT || PORT + "               *");
    console.log("*                 http://localhost:1100                *");
    console.log("********************************************************");

});


