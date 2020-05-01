const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt =  require('jsonwebtoken');

const saltRounds = 10;

const userSchema = mongoose.Schema({
    name:{
            type: String,
            maxlength:50
        },
    email:{
        type:String,
        trim: true,
        unique:true
    },
    password:{
        type:String,
        minlength:8
    },
    lastName:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,        // bcz there are admin and normal user
        default:0           //means normal user

    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

// for register
userSchema.pre('save', function(next){
    var schema  = this; 

    if(schema.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err);
    
            bcrypt.hash(schema.password, salt, function(err, hash){
                if(err) return next(err);
    
                schema.password = hash
                next()
            })
        })
    }else{
        next()
    }
  
});

// for login
userSchema.methods.checkPassword = function(plainPassword, cb){
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err);
        cb(null, isMatch)
    })
}

// for generate token
userSchema.methods.generateToken = function(cb){
    var user = this;
    //create token
    // token = userToken
    var userToken =  jwt.sign(user._id.toHexString(), 'secret' )
    user.token = userToken;

    //save all things done
    user.save(function(err, user){
        // cb means callback
        if(err) return cb(err)
        //if not error
        cb(null, user); // null means error is null 

    })
}

userSchema.statics.findByToken = function(token, cb){
    var user = this;
    jwt.verify(token, 'secret', function(err, decode){
        user.findOne({
            "_id" : decode,
            "token" : token
        },  function(err, user){
            if(err)
                return cb(err);
                cb(null, user);
                
        })

    })

}

//to create  user model, use mongoose.model, param 1 - name of the collection, param - 2 - schema

const UserModel = mongoose.model('User', userSchema); 

module.exports = {UserModel};

