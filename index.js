const express = require('express');
const app = express();
const mongoose = require('mongoose');

app.get('/', (req, res)=>{
    res.send('hello world');
});

mongoose.connect('mongodb+srv://fashion-store:fashion-store@db-5dk1r.mongodb.net/test?retryWrites=true&w=majority',
{useNewUrlParser:true} ).then(() => console.log('DB Connected')).catch(err => console.error(err));


app.listen(5000);

