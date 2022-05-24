const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');

app.use(bodyParser.json());



Router.get('/', (req, res, next) => {


    let sql = `SELECT s.slot_id,s.seats,DATE_FORMAT(s.time,"%H:%i") as time,DATE_FORMAT(s.date, "%Y-%m-%d") as date , t.interval, `
    +`(SELECT campus.Campus_name FROM campus WHERE campus.campus_id = r.pointa) orig , `
    +`(SELECT campus.Campus_name FROM campus WHERE campus.campus_id = r.pointb) dest `
    +`FROM slot s,route r, campus c ,slot_type t `
    +`WHERE c.campus_id = r.pointa `
    +`AND t.slotype_id = r.slottype `
    +`AND s.route_id = r.route_id `
    +`AND r.pointa = (SELECT campus.campus_id FROM campus WHERE campus.Campus_name = '${req.query.ori}') `
    +`AND r.pointb = (SELECT campus.campus_id FROM campus WHERE campus.Campus_name = '${req.query.dest}') `
    +`AND s.date = '${req.query.date}';`
    




    mariadb.query(sql, (err, rows, fields) => {
        if (!err) {
            res.send({
                error: false,
                data: rows,
            })
            return
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