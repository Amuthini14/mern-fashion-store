const mongoose = require('mongoose');

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
});

//to create  user model, use mongoose.model, param 1 - name of the collection, param - 2 - schema

const userModel = mongoose.model('User', userSchema); 

module.exports = {userModel};

