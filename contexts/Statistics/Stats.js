const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');
var CryptoJS = require("crypto-js");

app.use(bodyParser.json());



Router.get('/', (req, res, next) => {

        mariadb.query(`SELECT COUNT(*) as Registered FROM Student`, (err, reg_rows, fields) => {
            if (!err) {

                mariadb.query(`SELECT COUNT(*) as Deleted FROM Bus WHERE Status = 'Deleted'`, (err, del_rows, fields) => {

                    if (!err) {

                        let sql = 'SELECT COUNT(*) Active FROM Bus '                      
                        +'WHERE `Time` > TIME_FORMAT(CURRENT_TIME, "%H:%i") '
                        +'AND DATE_FORMAT(date, "%Y-%c-%e") >= DATE_FORMAT(CURRENT_DATE, "%Y-%c-%e") '
                        +'AND Status = "Active";'

                        mariadb.query(sql, (err, active_rows, fields) => {
                            if (!err) {

                                let sql2 = 'SELECT COUNT(*) Expired FROM Bus '                      
                                +'WHERE `Time` < TIME_FORMAT(CURRENT_TIME, "%H:%i") '
                                +'AND DATE_FORMAT(date, "%Y-%c-%e") < DATE_FORMAT(CURRENT_DATE, "%Y-%c-%e") '
                                +'AND Status = "Active";'

                                mariadb.query(sql2, (err, expired_rows, fields) => {
                                    if (!err) {
                                        res.send({
                                            error: false,
                                            reg:reg_rows[0].Registered,
                                            del:del_rows[0].Deleted,
                                            active:active_rows[0].Active,
                                            expired:expired_rows[0].Expired
                                        })
                                        return
                
                                    } else {
                                        res.send({
                                            error: true,
                                            code: "S001_SQL",
                                            message: "expired_row"
                                        })
                                        return
                                    }
                                })
                
                            } else {
                                res.send({
                                    error: true,
                                    code: "S001_SQL",
                                    message: "active_rows"
                                })
                                return
                            }
        
        
        
                        })
        
  
                    } else {
                        res.send({
                            error: true,
                            code: "S001_SQL",
                            message: "del_rows"
                        })
                        return
                    }

                })

            } else {
                res.send({
                    error: true,
                    code: "S001_SQL",
                    message: "reg_rows"
                })
                return
            }
        });
  



});



module.exports = Router;