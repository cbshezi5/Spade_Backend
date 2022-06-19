const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');

app.use(bodyParser.json());

function generatedSlot(Origin,Destination)
{
    let slotBounce 
    if(Origin == "Soshanguve South Campus" && Destination == "Arcadia Campus" || Origin == "Arcadia Campus" && Destination == "Soshanguve South Campus")
    slotBounce = 1
    if(Origin == "Soshanguve North Campus" && Destination == "Arcadia Campus" || Origin == "Arcadia Campus" && Destination == "Soshanguve North Campus")
    slotBounce = 1
    if(Origin == "Garankuwe Campus" && Destination == "Arcadia Campus" || Origin == "Arcadia Campus" && Destination == "Garankuwe Campus")
    slotBounce = 1
    if(Origin == "Pretoria Campus" && Destination == "Arcadia Campus" || Origin == "Arcadia Campus" && Destination == "Pretoria Campus")
    slotBounce = 15
    if(Origin == "Soshanguve South Campus" && Destination == "Pretoria Campus" || Origin == "Pretoria Campus" && Destination == "Soshanguve South Campus")
    slotBounce = 1
    if(Origin == "Soshanguve South Campus" && Destination == "Garankuwe Campus" || Origin == "Garankuwe Campus" && Destination == "Soshanguve South Campus")
    slotBounce = 1
    if(Origin == "Soshanguve South Campus" && Destination == "Soshanguve North Campus" || Origin == "Soshanguve North Campus" && Destination == "Soshanguve South Campus")
    slotBounce = 15
    if(Origin == "Soshanguve North Campus" && Destination == "Garankuwe Campus" || Origin == "Garankuwe Campus" && Destination == "Soshanguve North Campus")
    slotBounce = 1
    if(Origin == "Pretoria Campus" && Destination == "Soshanguve North Campus" || Origin == "Soshanguve North Campus" && Destination == "Pretoria Campus")
    slotBounce = 1
    if(Origin == "Pretoria Campus" && Destination == "Garankuwe Campus" || Origin == "Garankuwe Campus" && Destination == "Pretoria Campus")
    slotBounce = 1

    
    

    return slotBounce
}

Router.get('/', (req, res, next) => {

    let lastHour = 21
    let firstHour = 8
    let hour = lastHour - firstHour
    let sql = ""
    let sqlR = 'SELECT Scheduleid,Seats,DATE_FORMAT(time,"%H:%i") as time,DATE_FORMAT(date, "%e-%c-%Y") as date, SchedType '
    +'FROM Schedule '
    +'WHERE `From` = "'+req.query.ori+'" '
    +'AND `To` = "'+req.query.dest+'" '
    +'AND `Date` = "'+req.query.date+'";'
    

  
    mariadb.query(sqlR, async (err, rows, fields) => {
        if (!err) {

            if(rows.length < 1)
            {
                let slotBounce = generatedSlot(req.query.ori,req.query.dest)
                

                 
                if(slotBounce == 1)
                {
                    for (let index = 0; index < hour; index++) {

                        sql = `INSERT INTO Schedule VALUES(DEFAULT,'${req.query.ori}','${req.query.dest}','${firstHour++}:00:00','${req.query.date}',48,1,3,1,1);`
                        await mariadb.promise().query(sql)
                        
                        
                    }
                    
                } 
                
                if(slotBounce == 15)
                {
                    for (let index = 0; index < hour; index++) {
                        
                        sql = `INSERT INTO Schedule VALUES(DEFAULT,'${req.query.ori}','${req.query.dest}','${firstHour}:00:00','${req.query.date}',48,1,3,1,2); `
                        await mariadb.promise().query(sql)
                        sql = `INSERT INTO Schedule VALUES(DEFAULT,'${req.query.ori}','${req.query.dest}','${firstHour}:15:00','${req.query.date}',48,1,3,1,2); `
                        await mariadb.promise().query(sql)
                        sql = `INSERT INTO Schedule VALUES(DEFAULT,'${req.query.ori}','${req.query.dest}','${firstHour}:30:00','${req.query.date}',48,1,3,1,2); `
                        await mariadb.promise().query(sql)
                        sql = `INSERT INTO Schedule VALUES(DEFAULT,'${req.query.ori}','${req.query.dest}','${firstHour}:45:00','${req.query.date}',48,1,3,1,2); `
                        await mariadb.promise().query(sql)
                        firstHour++
                    }
                }

                mariadb.query(sqlR,(err_inner, rows_inner, fields_inner) => {
                    if(!err_inner)
                    {
                        res.send({
                            error: false,
                            data:rows_inner,
                            innner:"sad"
                        })
                        return
                    }
                    else
                    {
                        res.send({
                            error: true,
                            data:err_inner,
                            innner:"sad"
                        })
                        return
                    }
                });
               
            }
            else
            {
                res.send({
                    error: false,
                    data:rows,
                    out:"happy"
                })
                return
            }
            

        } else {
            res.send({
                error: true,
                code: "T001_SQL_GET",
                message: "id element was not found as a body element",
                sqlerror: err
            })
            return
        }
    });
});

module.exports = Router;