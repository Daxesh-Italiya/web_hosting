const mysql = require('mysql');
const jwt= require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const session = require('express-session');
var validator = require("email-validator");

const db = mysql.createConnection({
    host: process.env.DATABSE_HOST,
    user: process.env.DATABSE_USER,
    password: process.env.DATABSE_PASS,
    database: process.env.DATABSE_NAME

})


exports.register = (req, res) =>{
    console.log(req.body);

    const { name, email, pass, mobile_num }=req.body;

    
   
    db.query('SELECT email FROM user WHERE email=?', [email], async (error, results) =>{
        console.log(results);
        console.log("email Validation :"+validator.validate(email));

        if(error)
        {
            console.log("error="+ error);
            return res.render('rehister',{
                message: "This mobile already available",
                NAME:name,
                EMAIL:email, 
                MOBILE:mobile_num,
                PASS:pass
            });
        }else{
            console.log("No Email Error");
        }

        if(results.length > 0)
        {
            console.log("Email aready exist");

            return res.render('rehister',{
                message: "This email already available",
                NAME:name,
                EMAIL:email, 
                MOBILE:mobile_num,
                PASS:pass
            });
        }else if(!validator.validate(email))
        {
            console.log("Email ID NOT valid");

            return res.render('rehister',{
                message: "Please Enter Email ID",
                NAME:name,
                EMAIL:email, 
                MOBILE:mobile_num,
                PASS:pass
            });
        }


        let hashedPassword = await bcrypt.hash(pass,8);
        console.log(hashedPassword);

        db.query('INSERT INTO user SET ?',{name:name, email:email, password:hashedPassword, mobile_num:mobile_num },(error, results)=>{
            if(error){
                console.log(error);
                return res.render('rehister',{
                    message: "This Mobile number already available",
                    NAME:name,
                    EMAIL:email, 
                    MOBILE:mobile_num,
                    PASS:pass
                });
            }
            else{
                console.log("Login");

                    req.session.name=name;
                    req.session.email=email;
                    req.session.mobile_num=mobile_num;
                    res.redirect('/home');
            }
        });
    });

    

 
}

exports.login = async (req, res) =>{

    try{

        console.log(req.body);

        const { email, your_pass }=req.body;

        if(!email )
        {
            console.log("Please Enter Email ID");

            return res.render('index',{
                log_message: "Please Enter Email ID",
                EMAIL:email, 
                your_pass:your_pass
            });
        }
        else if(!your_pass)
        {
            console.log("Please Enter Password");

            return res.render('index',{
                log_message: "Please Enter Password",
                EMAIL:email, 
                your_pass:your_pass
            });
        }
        else if(!validator.validate(email))
        {
            console.log("Email ID NOT valid");

            return res.render('index',{
                log_message: "Please Enter Valid Email ID",
                EMAIL:email, 
                your_pass:your_pass
            });
        }
        
        db.query('SELECT * FROM user WHERE email=?', [email], async (error, results) =>{
            if(error){
                console.log(error);
            }
            
            console.log("email Validation :"+validator.validate(email));
    
            if(results.length > 0)
            {
                console.log(results);
                console.log(your_pass);
                console.log(results[0].password);
                if((await bcrypt.compare(your_pass,results[0].password)))
                {
                    console.log("Login");

                    req.session.name=results[0].name;
                    req.session.email=results[0].email;
                    req.session.mobile_num=results[0].mobile_num;
                    res.redirect('/home');
                    
                }else{

                    console.log("Email or password is incorrect"); 
                    return res.render('index',{
                        log_message: "Email or password is incorrect",
                        EMAIL:email, 
                        your_pass:your_pass
                    });  
                    

                    // const token = jwt.sign({email}, process.env.JWT_SECRATE,{
                    //     expiresIn: process.env.JWT_EXPIERS_IN
                    // });

                    // console.log(" the token is "+ token);

                    // const cookieOption={
                    //     expiresIn: new Date(
                    //         Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 *1000
                    //     ),
                    //     httpOnly: true
                    // }
                    // res.cookie('jwt',token,cookieOption);
                    // res.status(200).redirect('/home');

                }
            
            }else
            {
                console.log("Email does not exist");
    
                return res.render('index',{
                    log_message: "Emaild does not exist",
                    EMAIL:email, 
                    your_pass:your_pass
                });
            }
    
           
        });
    }catch(error){
        console.log(error);
    }

    

    

 
}