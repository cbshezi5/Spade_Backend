const express = require('express');
const app = express();
const Router = express.Router();
const mariadb = require('../../connection');
const bodyParser = require('body-parser');
var CryptoJS = require("crypto-js");
const multer = require('multer');
const path = require('path');

app.use(bodyParser.json());


const handleErr = (error, req, res, next) => {
    res.status(400).send(error.message)
    return
}

const imageStorage = multer.diskStorage({
    // Destination to store image     
    destination: 'bin/images', 
      filename: (req, file, cb) => {
          cb(null, file.fieldname + '_' + Date.now() 
             + path.extname(file.originalname))
            // file.fieldname is name of the field (image)
            // path.extname get the uploaded file extension
    }
});

const imageUpload = multer({
    storage: imageStorage,
    limits: {
      fileSize: 10000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(png|jpg|PNG|JPG|JPEG|GIF|gif|jpeg)$/)) { 
         // upload only png and jpg format
         return cb(new Error('Please upload a Image'))
       }
     cb(undefined, true)
  }
})

Router.post('/Student/Upload', imageUpload.single('image'), (req, res, next) => {

    

    if (Object.keys(req.body).length == 0) {
        res.send({
            error: true,
            code: "P001",
            message: "body parameters were not found"
        })
        return
    }

    if (req.body.Studentid) {
        mariadb.query(`SELECT profilepicture FROM Student WHERE Studentid = ${req.body.Studentid}`, (err, rows, fields) => {
            if (!err) {
                if(rows[0].profilepicture)
                {
                    res.send({
                        error: false,
                        data: rows,
                        already:true
                    })
                    return
                }
                else
                {
                    if(req.file)
                    {
                        let image_path = req.file.filename;
                        mariadb.query(`UPDATE Student  SET profilepicture = 'localhost:1100/images/${image_path}'  WHERE Studentid = ${req.body.Studentid}`, (err, rows, fields) => {
                            if(!err)
                            {
                                res.send({
                                    error: false,
                                    data: rows,
                                })
                                return
                            }
                            else
                            {
                                res.send({
                                    error: true,
                                    code: "UPDATESQL",
                                    message: err
                                })
                                return
                            }
                        });
                    }
                    else
                    {
                        res.send({
                            error: true,
                            data: "Select your face image for administrator to use for confirm perpose",
                            already:false
                        })
                    }
                }
                
            } else {
                res.send({
                    error: true,
                    code: "P001_SQL",
                    message: "field Studentid was not found as a body Studentid"
                })
                return
            }
        });
    } else {
        res.send({
            error: true,
            code: "P002",
            message: "field element was not found as a body Studentid"
        })
        return
    }



},handleErr);



module.exports = Router;