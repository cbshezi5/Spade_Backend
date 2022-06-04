//Module Importing
const express = require('express');
//const mysql = require('mysql');
const app = express();
const bodyParser = require('body-parser');
//const prompt = require('prompt-sync')();
const socket = require('socket.io')
const connection = require("./connection")
//Context file object

//Student
const Campus_cnxt = require('./contexts/Common/AllCampuses')
const Registration_cnxt = require('./contexts/Authentication/Registration')
const Login_cnxt = require("./contexts/Authentication/Login")
const Student_cnxt = require("./contexts/Common/Students")
const Forgotten_cnxt = require("./contexts/Authentication/Forgotten")
const SendEmail_cnxt = require("./contexts/nodemailer")
//Admin
//const RegistrationAdm_cnxt = require('./contexts/Authentication/Register_Adm')
const LoginAdm_cnxt = require("./contexts/Authentication/Login_Adm")

// //common
const Stats_cnxt = require('./contexts/Statistics/Stats')
const Track_cnxt = require('./contexts/Tracking/Tracking')


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
app.use('/Auth/Registration', Registration_cnxt);
app.use('/Auth/Student', Student_cnxt);
app.use('/Auth/Login', Login_cnxt);
app.use('/Auth/Forgotten',Forgotten_cnxt)
app.use('/Content/Campus',Campus_cnxt)
app.use('/',SendEmail_cnxt)

//context channelling Admin
//app.use('/Auth/Registration_Admin', RegistrationAdm_cnxt);
app.use('/Auth/Login_Admin', LoginAdm_cnxt);

//context to common entities
app.use('/Stat/Stats', Stats_cnxt);
app.use('/Track/Tracking', Track_cnxt)

const PORT = 1100

var server = app.listen(PORT, (e) => {
    console.log("********************************************************");
    console.log("* DB: localhost:3306 DBname:'buspoint_db_schema'       *");
    console.log("*                PORT is running on " + PORT + "               *");
    console.log("*                 http://localhost:1100                *");
    console.log("********************************************************");

});


