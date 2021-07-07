const express = require('express');
const session = require('express-session');

const router = express.Router();

router.get('/',(req, res) =>{
    res.render('index');
})

router.get('/register',(req, res) =>{
    res.render('rehister');
})

router.get('/login',(req, res) =>{
    res.render('index');
})

router.get('/logout',(req, res) =>{
    
    req.session.destroy();
    return res.redirect('login');
})

router.get('/home',(req, res) =>{
    var Session=req.session;
    if(!Session.name)
    {
        return res.redirect('login');
    }else{
        console.log("your mail is"+Session.name);
        return res.render('home',{
            NAME:Session.name
        });
    }
    
})

module.exports=router;