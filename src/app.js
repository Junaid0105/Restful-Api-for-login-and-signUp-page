const express = require("express");

require("../src/db/connection");

const Pro = require("../src/models/Pr_Schema");

const Sign_ = require("../src/models/SignPageSchema");

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const app = express();



const port = process.env.PORT || 3000;

//we  will handle post request-----------------------------------------------------

app.use(express.json());

app.post("/Pr_Schema",async(req,res)=>{
    try{
        console.log("Post Request Success ");
        const AddingProjectRecord = new Pro(req.body)
        console.log(req.body);
        const insertProject = await AddingProjectRecord.save();
        res.status(201).send(insertProject);

    }catch(e){
        res.status(400).send(e);
    }

})
//-------------------------------------------------------------------------------------

// we will handle get request-----------------
app.get("/Pr_Schema",async(req,res)=>{
    try{

        const getProject = await Pro.find({});
        res.send(getProject);
    }catch(e){
        res.status(400).send(e);
    }
    
})
//-----------------------------------------------------------------------------







//we will handle get request for individuals----------------------------
app.get("/Pr_Schema/:id",async(req,res)=>{
    try{
        const _id = req.params.id;

        const GetById = await Pro.findById(_id);
        res.send(GetById);
    }catch(e){
        res.status(400).send(e);
    }
})  
//--------------------------------------------------------------------








// We will handle update Request -----------------------------------------
app.get("/Pr_Schema/:id",async(req,res)=>{
    try{
        const _id = req.params.id;

        const GetById = await Pro.findByIdAndUpdate(_id,req.body,{
            new:true 
        });
        res.send(GetById);
    }catch(e){
        res.status(400).send(e);
    }
}) 
//----------------------------------------------------------------------------



//Create route for user registration-----------------------------------------
// convert password into hash using bcrypt
app.post('/register',(req,res)=>{
    bcrypt.hash(req.body.password,10,(err, hash)=>{
        if(err){
            return res.status(500).json({
                error:err
            })
        }
        else{
            //app.post("/register",(req,res)=>{
                //check to make sure email provided not registerd---
                Sign_.findOne({email:req.body.email}).then((user)=>{
                    if(user){
                        return res.status(400).json({email:"A user has already registerd with this email"});
                    }else{
                        const user = new Sign_({
                            Name : req.body.Name,
                            email : req.body.email,
                            password : hash
                        });
                        user.save();
                        return res.status(200).json({msg: user})
            
                    }
                });
           // })

        }
    })
})
//-------------------------------------------------------------------------------

//create api for login-----------------------------------------------------------
app.post('/login',(req,res)=>{
    Sign_.find({email:req.body.email})
    .exec()
    .then(user=>{
        if (user.length<1){
            return res.status(401).json({
                msg:"User not Exist"
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err, result)=>{
            if(!result)
            {
                return res.status(401).json({
                    msg:'Password not matched'
                })
            }
            if(result)
            {
                const token = jwt.sign({
                    Name:user[0].Name,
                    email:user[0].email
                },
                'this is dummy text',
                {
                    expiresIn:"24h"
            });
            res.status(200).json({
                Name:user[0].Name,
                email:user[0].email,
                token:token
            })

            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            err:err 
        })
    })
})






//---------------------------------------------------------------------------------








// request for fetch register data---------------------------------------------
app.get("/SignPageSchema",async(req,res)=>{
    try{

        const getRegisterRecord = await Sign_.find({});
        res.send(getRegisterRecord);
    }catch(e){
        res.status(400).send(e);
    }
    
})
//------------------------------------------------------------------------------







app.get("/",async (req,res)=>{
    res.send("Hello NativeByte"); 
})

app.listen(port, ()=>{
    console.log('Connection is live at port no. 3000');
})