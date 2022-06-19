const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');
const e = require('express');


app.use(bodyParser.json());




Router.delete('/Student/DeleteProfile',(req, res, next)=>{
    if (Object.keys(req.query).length == 0) {
        res.send({
            error: true,
            code: "C001_GET",
            message: "query parameters were not found"
        });
        return
    }

    if (req.query.id) {
        
        mariadb.query('DELETE FROM Student WHERE Studentid = '+req.query.id+';', (err, rows) => {
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
        message: "id was not recieved from query arguements"
    });
    return
}
    
})

Router.put('/Student/UpdateProfile',(req, res, next)=>{
    if (Object.keys(req.body).length == 0) {
        res.send({
            error: true,
            code: "C001_GET",
            message: "query parameters were not found"
        });
        return
    }

    if (req.body.id) {
        
        mariadb.query('UPDATE Student SET profilepicture = NULL WHERE Studentid = '+req.body.id+';', (err, rows) => {
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
        message: "id was not recieved from body arguements"
    });
    return
}
    
})


Router.put('/Student/ClearAll',(req, res, next)=>{
    if (Object.keys(req.body).length == 0) {
        res.send({
            error: true,
            code: "C001_GET",
            message: "query parameters were not found"
        });
        return
    }

    if (req.body.id) {
        
        mariadb.query('UPDATE Bus SET Status = "Deleted" WHERE Studentid = '+req.body.id+';', (err, rows) => {
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
        message: "id was not recieved from body arguements"
    });
    return
}
    
})

Router.get('/Administrator/GetBooked', (req, res, next) => {
    
    let surveyUser = [];

    mariadb.query(`SELECT Student.studentid as id, StudentNumber as StudentNo, firstname as Firstname, lastname as Lastname, Student_Email as Email FROM Student ,Bus WHERE Bus.studentid = Student.studentid GROUP BY Student.studentid;`,async (err,outer_rows,fields)=>{

        if(err || outer_rows.length < 1)
        {
            res.send({
                error:true,
                message:"Error sql statement couldn't execute successfully",   
                code:"O001_POST_SQL",
                sqlMessage:err        
            })
            return;
        }
        for (let index = 0; index < outer_rows.length; index++) {
            await mariadb.promise().query('SELECT CONCAT("Booking ", Busid) as answer, CONCAT("From ", `From`," To ",`To`," Date ",`Date`," Time ",`Time` ) as question FROM Bus WHERE Studentid = '+outer_rows[index].id+' AND Status <> "Deleted" AND NOT DATE_FORMAT(date, "%Y-%c-%e") < DATE_FORMAT(CURRENT_DATE, "%Y-%c-%e") AND NOT `Time` < TIME_FORMAT(CURRENT_TIME, "%H:%i") UNION ALL SELECT CONCAT("Booking ", Busid) as answer, CONCAT("From ", `From`," To ",`To`," Date ",`Date`," Time ",`Time` ) as question FROM Bus WHERE Studentid = '+outer_rows[index].id+' AND Status <> "Deleted" AND DATE_FORMAT(date, "%Y-%c-%e") > DATE_FORMAT(CURRENT_DATE, "%Y-%c-%e");')
            .then((data)=>{
                if(data[0][0])
                {
                    surveyUser[index] = 
                        {
                            Id : index,
                            Firstname : outer_rows[index].Firstname,
                            Lastname :  outer_rows[index].Lastname,
                            StudentNo : outer_rows[index].StudentNo,
                            Email : outer_rows[index].Email,
                            Survey : data[0]
                        }
                    
                }
                
            })  
        }

        res.send(surveyUser)
        
    })


});



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
        
            mariadb.query('SELECT `Busid`,`Studentid`,`From`,`To`,`Status`,`Temporally`,TIME_FORMAT(Time, "%H:%i") AS Time,`Date` FROM Bus WHERE Studentid = '+req.query.id+' AND Status <> "Deleted"', (err, rows) => {
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

Router.delete('/Student/GetBooked', (req, res, next) => {
    if (Object.keys(req.query).length == 0) {
        res.send({
            error: true,
            code: "C001_DEL",
            message: "query parameters were not found"
        });
        return
    }

    if (req.query.Busid) {
        mariadb.query(`UPDATE Bus SET Status = 'Deleted' WHERE Busid= ${req.query.Busid}`,(err, rows)=>{
            if(!err)
            {
                res.send({
                    error: false,
                    data: rows,
                });
                return
            }
            else
            {
                res.send({
                    error: true,
                    code: "C001_DEL",
                    message: err
                });
                return
            }
        })
        
    }


    if(req.query.studentid)
    {
            mariadb.query(`UPDATE Bus SET Status = 'Deleted' WHERE Studentid = ${req.query.Studentid}`,(err, rows)=>{
                if(!err)
                {
                    res.send({
                        error: false,
                        data: rows,
                    });
                    return
                }
                else
                {
                    res.send({
                        error: true,
                        code: "C001_DEL",
                        message: err
                    });
                    return
                }
            })
    }
});

Router.post('/Student/Book',(req, res, next)=>{
    mariadb.query(`SELECT * FROM Bus WHERE Studentid = ${req.body.Studentid} AND DATE_FORMAT(date, "%Y-%c-%e") = '${req.body.date}' AND Status ='Active'`,(err, rows,field)=>{
        if(!err)
        {
            if(rows.length > 2)
            {
                res.send({
                    error:true,
                    message:"You have reach the limit for concurrent bookings of the day"
                })
                return
            }
            else
            {
                let sql = 'SELECT * FROM Bus '
                +'WHERE Studentid = '+req.body.Studentid+' '
                +'AND `From` = "'+req.body.ori+'" '
                +'AND `To` = "'+req.body.dest+'" '
                +'AND `Time` = "'+req.body.time+'" '
                +'AND DATE_FORMAT(date, "%Y-%c-%e") = "'+req.body.date+'" '
                +'AND Status = "Active";'
                
               
                mariadb.query(sql,(err_m, rows_m,field_m)=>{
                    if(!err_m)
                    {
                      
                        if(rows_m.length < 1 )
                        {
                            mariadb.query(`INSERT INTO Bus VALUES(DEFAULT,${req.body.Studentid},'${req.body.ori}','${req.body.dest}','Active','P','${req.body.time}',DATE_FORMAT('${req.body.date}', "%Y%-%m-%d"))`,(err, rows,field)=>{
                                if(!err)
                                {
                                    mariadb.query(`SELECT Seats FROM Schedule WHERE Scheduleid = ${req.body.Scheduleid}`,(err_x, rows_x)=>{
                                        
                                        mariadb.query(`UPDATE Schedule SET Seats = ${rows_x[0].Seats - 1} WHERE Scheduleid = ${req.body.Scheduleid}`,(err_n, rows_n,field_n)=>{
                                            if(!err_n)
                                            {
                                                res.send({
                                                    error:false,
                                                    data:rows,
                                                    inner:rows_n
                                                })
                                                return
                                            }
                                        });

                                    });
                                }
                                else
                                {
                                    res.send({
                                        error:true,
                                        message:err
                                    })
                                    return
                                }
                            });
                        }
                        else
                        {
                            res.send({
                                error:true,
                                message:"You can only book the bus once"
                            })
                            return
                        }
                    }
                    else
                    {
                        res.send({
                            error:true,
                            message:err_m
                        })
                        return
                    }
                });
            }
        }
        else
        {
            res.send({
                error:true,
                message:err
            })
            return
        }
    })
})

module.exports = Router;