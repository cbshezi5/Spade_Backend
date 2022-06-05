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