const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');
var CryptoJS = require("crypto-js");



app.use(bodyParser.json());


Router.post('/',async (req, res, next) => {


    if (Object.keys(req.body).length == 0) {
        res.send({
            error: true,
            code: "R001",
            message: "body parameters were not found"
        });
        return
    }


    if (!req.body.fname) {
        res.send({
            error: true,
            code: "R002",
            message: "first name was not found"
        });
        return
    }
    if (!req.body.lname) {
        res.send({
            error: true,
            code: "R003",
            message: "last name was not found"
        });
        return
    }
    if (!req.body.password) {
        res.send({
            error: true,
            code: "R004",
            message: "password were not found"
        });
        return
    }
    
    if (!req.body.email) {
        res.send({
            error: true,
            code: "R006",
            message: "email was not found"
        });
        return
    }

    if (!req.body.role) {
        res.send({
            error: true,
            code: "R007",
            message: "role was not found"
        });
        return
    }
    if (!req.body.studNum) {
        res.send({
            error: true,
            code: "R005",
            message: "student number was not found"
        });
        return
    }
    
    var ciphertext = CryptoJS.AES.encrypt(req.body.password, "123").toString();

    var sql =''
    let x = false
    if(req.body.role == 'S')
    {
        
       
         await mariadb.promise().query(`SELECT student_id FROM student WHERE student_email = '${req.body.email}' OR studentnumber = '${req.body.studNum}'`)
        .then((data)=>{
            if(data[0][0]?.student_id)
            {
                x = true
                res.send({
                    error: true,
                    message: "Email Already exist"
                }); 
                return
            }

            sql = "INSERT INTO `student`(`student_id`, `firstname`, `lastname`, `password`, `student_email`, `studentnumber`) "+ 
            "VALUES (DEFAULT,'"+req.body.fname+"','"+req.body.lname+"','"+ciphertext+"','"+req.body.email+"','"+req.body.studNum+"');";
        })
        .catch((err)=>{
            console.log("err")
        })
        
    }

    if(req.body.role == 'T')
    {
        sql = "INSERT INTO `admitter`(`admitter_id`, `firstname`, `lastname`, `password`, `email`) "+ 
        "VALUES (DEFAULT,'"+req.body.fname+"','"+req.body.lname+"','"+ciphertext+"','"+req.body.email+"');";
    
    }

    if(req.body.role == 'A')
    {
        sql = "INSERT INTO `administrator`(`admin_id`, `firstname`, `lastname`, `password`, `email`) "+ 
        "VALUES (DEFAULT,'"+req.body.fname+"','"+req.body.lname+"','"+ciphertext+"','"+req.body.email+"');";
    }

    if(x)
        return

    if(sql == '')
    {
        res.send({
            error: true,
            message: "Error role sent"
        }); 
        return
    }
    
    
    try {
     
        mariadb.query(sql, (err, rows, fields) => {
            if (!err) {
                res.send({
                    error: false,
                    data: rows
                });
                console.log(new Date() + " - A student successfully registered " + req.body.email)
                return
            } else {
                if (err.code == 'ER_DUP_ENTRY') {

                    if (err.sqlMessage.search("email") != -1) {
                        res.send({
                            error: true,
                            message: "Email already exist in the system",
                            code: "R001_SQL_DUP"
                        });
                        return
                    } else {
                        res.send({
                            error: true,
                            message: "Student Number is already existing on the system",
                            code: "R002_SQL_DUP"
                        });
                        return
                    }
                }
                res.send({
                    error: true,
                    message: err,
                    code: "R001_SQL"
                });
                return
            }
        })
    } catch (e) {
        console.log(e.code)
    }

});

Router.delete('/',async (req, res, next)=>{
    if (Object.keys(req.query).length < 1) {
        res.send({
            error: true,
            code: "D001",
            message: "query parameters were not found"
        });
        return
    }

    if(!req.query.email)
    { 
        res.send({
            error: true,
            code: "D001",
            message: "query parameters were not found specifically email"
        }); 
    }

    mariadb.query(`DELETE FROM student WHERE student_email = '${req.query.email}'`,(err,result,field)=>{
        if(err)
        res.send({
            error:true,
            code:"D002",
            message:err
        })

        res.send({
            error:false,
            data:result
        })

    })
})

Router.put('/',async (req,res,next)=>{
    if (Object.keys(req.query).length < 1) {
        res.send({
            error: true,
            code: "U001",
            message: "query parameters were not found"
        });
        return
    }

    if(!req.query.email)
    { 
        res.send({
            error: true,
            code: "U002",
            message: "query parameters were not found specifically email"
        }); 
    }

    if(!req.query.fname)
    { 
        res.send({
            error: true,
            code: "U003",
            message: "query parameters were not found specifically fname"
        }); 
    }

    if(!req.query.lname)
    { 
        res.send({
            error: true,
            code: "U004",
            message: "query parameters were not found specifically lname"
        }); 
    }

    mariadb.query(`UPDATE student SET firstname = '${req.query.fname}', lastname = '${req.query.lname}' WHERE student_email = '${req.query.email}'`,(err,result,field)=>{
        if(err)
        res.send({
            error:true,
            code:"D002",
            message:err
        })

        res.send({
            error:false,
            data:result
        })

    })
})

Router.get('/',async (req,res,next)=>{
    if (Object.keys(req.query).length < 1) {
        res.send({
            error: true,
            code: "G001",
            message: "query parameters were not found"
        });
        return
    }

    if(!req.query.email)
    { 
        res.send({
            error: true,
            code: "G002",
            message: "query parameters were not found specifically email"
        }); 
    }

    mariadb.query(`SELECT * FROM student WHERE student_email = '${req.query.email}'`,(err,result,field)=>{
        if(err)
        res.send({
            error:true,
            code:"G003",
            message:err
        })

        res.send({
            error:false,
            data:result
        })

    })

})

module.exports = Router;