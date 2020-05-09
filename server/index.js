const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('../config/key');
// instead of User i  do UserModel
const {UserModel} = require('./models/user');
const {authentication} = require("./middleware/authentication");





mongoose.connect( config.mongoDbURI,
{useNewUrlParser:true} ).then(() => console.log('DB Connected')).catch(err => console.error(err));


//sample testing to heroku
app.get("/", (req, res) => {
    res.json({"hello": "check deployment to heroku"})
})



// body-parser as middle ware
app.use(bodyParser.urlencoded({extended:true}));
// to be able to read the json
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.json({"hello": "happy to deploy to heroku"})

});



app.get('/api/user/auth',authentication, (req, res) => {
        res.status(200).json({
            _id:req._id,
            isAuth : true,
            email : req.user.email,
            name : req.user.name,
            lastName : req.user.lastName,
            role : req.user.role
        })
})










// method for register
app.post('/api/users/register', (req, res) =>{

    const userModel = new UserModel(req.body);
    
    userModel.save((err, doc) => {
        if(err) return res.json({success:false, err});
        return res.status(200).json({success:true,
                                    userData : doc
                                                });

    });
});



// method for user login
app.post('/api/user/login', (req, res) => {

    //find the email in database
    UserModel.findOne({email: req.body.email }, (err, user) => {
        if(!user)
            return res.json({
                loginSucces : false,
                message : "Email Not Found"
            });

    //check the typed password and database password are same or not
    // checkPassword = comparePassword
    user.checkPassword(req.body.password, (err, isMatch) =>{
        if(!isMatch){
            return res.json({
                loginSucces : false,
                message : "Password is not Correct "
            })
        }

    })

    



    //generate token for logged in user
    user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        //if  token is generayed successfully  put the token into cookie
       // user_cookie = x_auth
        res.cookie("user_cookie", user.token).status(200).json({
            loginSucces : true
        })


    })

    })

})

// for logout routing
app.get('/api/user/logout',authentication, (req, res ) =>{
    
    UserModel.findOneAndUpdate({_id: req.user._id},
        {token : ""},
        (err, doc) =>{
            if(err) return res.json({logOutSuccess : false, err})
            return res.status(200).send({
                logOutSuccess : true
            })
        })


})

// make the port dynamic , sothat we can run the app to the give port by heroku(5000 - only for development mode)
const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server Running At ${port}`);
});

