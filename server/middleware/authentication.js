//authentication = auth
// this folder is for the users who are authenticated

const {UserModel} = require('../models/user');


//check the user is authenticated or not
let authentication = (req, res, next) =>{
    let token = req.cookies.user_cookie;


//check whether user is defined
UserModel.findByToken(token, (err, user) =>{
    if(err) throw err;
    if(!user) return res.json({
        isAuthenticate : false,   //isAuthenticate isAuth
        error : true
    });

    req.token = token;
    req.user = user;
    next();



})

}

module.exports = {authentication};


