const asyncHandler = require("../middlewares/async")
const ErrorResponse = require("../utils/errorResponse")    
const User = require("../models/User");
const express = require("express");



//@desc  Register user
//@route  GET/api/v1/auth?register
//@access Public


exports.register = asyncHandler (async (req,res,next) => {
    const { name ,email,password,role} = req.body
    const user = await User.create({
        name ,email,password,role
    });
     
    res.status(200).json({
        success : true
    })
});
