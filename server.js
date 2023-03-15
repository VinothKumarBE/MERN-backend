const express = require('express');

const bodyParser = require('body-parser') ;

const placesRoutes = require('./routes/places-routes')

const usersRoutes = require('./routes/users-routes')

const HttpError = require('./models/http-error')

const mongoose = require('mongoose');

const dotenv = require('dotenv');

dotenv.config({path:'./.env'});

const app =express();

app.use(bodyParser.json())

app.use('/api/places',placesRoutes);
app.use('/api/users',usersRoutes);

app.use((req,res,next)=>{
    const  error = new HttpError('Could not  find this route.', 404)
    throw error;

});

app.use((error, req, res, next)=>{
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unkinbown error Occuree"})
})


const DB = process.env.DATABASECONNECTION

mongoose.connect(DB,{
    useNewUrlParser: true,
    useUnifiedTopology: true,

}).then(()=>console.log('DB CONNECTION SUCESSFULLY🙂🙂'));

const  port  = process.env.PORT || 4500;
app.listen(port,() =>{
    console.log(`App running on port ${port}...`);
})

