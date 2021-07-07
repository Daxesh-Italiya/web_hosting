const express = require('express');
const mysql = require('mysql');
const dotenv= require('dotenv');
const path = require('path');
const session = require('express-session');
const cookieParser = require('cookie-parser')

dotenv.config({path:'./.env'})
const app = express();

const db = mysql.createConnection({
    host: process.env.DATABSE_HOST,
    user: process.env.DATABSE_USER,
    password: process.env.DATABSE_PASS,
    database: process.env.DATABSE_NAME

})

const publicDirectory =path.join(__dirname,'./public');
app.use(express.static(publicDirectory));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(session({
  
    // It holds the secret key for session
    secret: process.env.JWT_SECRATE,
  
    // Forces the session to be saved
    // back to the session store
    resave: true,
  
    // Forces a session that is "uninitialized"
    // to be saved to the store
    saveUninitialized: true
}))

app.set('view engine', 'hbs');

db.connect((error) => {
    if(error)
    {
        console.log(error);
    }else
    {
        console.log("Database Connected")
    }
})



// app.get('/', (req, res) =>{
//     // res.send("<h1>Home Page</h1>")
//     res.render('index')
// })

// app.get('/register', (req, res) =>{
//     // res.send("<h1>Home Page</h1>")
//     res.render('rehister')
// })

// app.get('/login', (req, res) =>{
//     // res.send("<h1>Home Page</h1>")
//     res.render('rehister')
// })

app.use('/',require('./rought/pages'));

app.use('/auth',require('./rought/auth'));

app.listen(8000,() =>{
    console.log("Server Started")
})