const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({

    name : {
        type : String,
        required : [true,"please add a name"]
    },
    email : {
        type : String,
        required : [true,"please add a email"],
        unique : true,
        match : [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,'use valid email']
    },
    role : {
        type : String,
        enum : ["user","publisher"],
        default : "user"
    },
    password : {
        type : String,
        require : [true,"please add a password"],
        minlength :6,
        select : false

    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    createdAt : {
        type : Date,
        default : Date.now
    }
      

});


// encrypt password using bycrypt
UserSchema.pre('save',async function(next){
    const  salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);


});

// sign JWT and return
UserSchema.methods.getSignedjwtToken = function() =>


module.exports = mongoose.model('User',UserSchema);