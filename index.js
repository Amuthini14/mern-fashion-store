const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

const {UserModel} = require('./models/user');


// app.get('/', (req, res)=>{
//     res.send('hello world');
// });

mongoose.connect( config.mongoDbURI,
{useNewUrlParser:true} ).then(() => console.log('DB Connected')).catch(err => console.error(err));

// body-parser as middle ware
app.use(bodyParser.urlencoded({extended:true}));
// to be able to read the json
app.use(bodyParser.json());
app.use(cookieParser());

app.post('/api/users/register', (req, res) =>{

    const userModel = new UserModel(req.body);
    
    userModel.save((err, doc) => {
        if(err) return res.json({success:false, err});
        return res.status(200).json({success:true,
                                    userData : doc
                                                });

    });
});


app.listen(5000);

