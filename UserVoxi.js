const express = require('express');
const app = express();
const Router = express.Router();
const bodyParser = require('body-parser');
const e = require('express');
const VoximplantApiClient = require('@voximplant/apiclient-nodejs').default;


app.use(bodyParser.json());

let client;
function init () {
    return new Promise((resolve) => {
        client = new VoximplantApiClient('voxikeysrole.json');

        client.onReady = function () {
            resolve()
        };
    })
}


// Get Method For Students 
Router.post('/', async (req, res, next) =>  {  

    await init().catch((e)=>console.log(e))
    try {
        client.Users.addUser({userName: req.body.username,
            userDisplayName: req.body.displayname,
            userPassword: req.body.password,
            applicationId: '10453252'})
        .then((env)=>{
            res.send({error:false,message:'Voximplant User Registered'})
            return;
        })
        .catch((err)=>{
            res.send({error:true,message:err})
            return;
        });
        
    } catch (error) {
        res.send({error:true,message:error})
            return;
    }
});

Router.delete('/', async (req, res, next) =>  {  

    await init().catch((e)=>console.log(e))
    try {
        client.Users.delUser({userName: req.body.username,
            applicationId: '10453252'})
        .then((env)=>{
            res.send({error:false,message:'Voximplant User Deleted'})
            return;
        })
        .catch((err)=>{
            res.send({error:true,message:err})
            return;
        });
        
    } catch (error) {
        res.send({error:true,message:error})
            return;
    }
});

Router.put('/', async (req, res, next) =>  {  

    await init().catch((e)=>console.log(e))
    try {
        client.Users.setUserInfo(
            {
                userName: req.body.username,
                applicationId: '10453252',
                userDisplayName:newDisplayName})
        .then((env)=>{
            res.send({error:false,message:'Voximplant User Update'})
            return;
        })
        .catch((err)=>{
            res.send({error:true,message:err})
            return;
        });
        
    } catch (error) {
        res.send({error:true,message:error})
            return;
    }
});


module.exports = Router