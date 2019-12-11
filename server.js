const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const user = require('./routes/api/user');

const app = express();
const PORT = 4000;

app.use(
    bodyParser.urlencoded({
        extended: false
}));

app.use(bodyParser.json());

const db = require('./config/keys').mongoURI;

mongoose.connect(db,{urlencoded: true})
    .then(()=>{
        console.log("Database Successfully connected");
    })
    .catch(err=>console.log(`database error: ${err}`));
    

app.use(passport.initialize());
require('./config/passport')(passport);
app.use("/api/user", user);

app.listen(PORT,()=>{
    console.log(`server is running port On ${PORT}`);
})