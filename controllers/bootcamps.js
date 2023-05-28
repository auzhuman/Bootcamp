const path = require("path")
const asyncHandler = require("../middlewares/async")
const ErrorResponse = require("../utils/errorResponse")    
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder");
const express = require("express");
const { error } = require("console");
 
//@desc   Get all bootcamps
//@route  GET/api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler( async(req,res,next) => {
        
    
        res
        .status(200).json(res.advancedResults);

});


//@desc   Get a single  bootcamps
//@route  GET/api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler( async(req,res,next) => {
    // try {
        const bootcamp = await Bootcamp.findById(req.params.id).populate('courses');;
        // if bootcamp id is not same throw error
        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with ID ${req.params.id}`,404)
             );

            // res.status(400).json({
            //     succes:false
            // })
        }
        res.status(200).json({
            succes:true,
            data:bootcamp
        })
        
    // } catch (error) {
    //     // next(new ErrorResponse(`Bootcamp not found with ID ${req.params.id}`,404))
    //     next(error)
        
    //     // res.status(400).json({success:false})
        
    // }
    // res.status(200).json({success:true,msg : `showing bootcamp ${req.params.id}`})
} );

//@desc   create a new bootcamp
//@route  POST/api/v1/bootcamps
//@access Private
exports.createBootcamp = asyncHandler( async (req,res,next) => {
    
    // try {
        const bootcamp = await Bootcamp.create(req.body )
    res.status(200).json({
        success:true, 
        data:bootcamp
    })
        
  
  
});
//@desc   update a single  bootcamps
//@route  POST/api/v1/bootcamps/:id
//@access Private
exports.updateBootcamp = asyncHandler( async(req,res,next) => {
      
    // try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new : true,
            runValidators : true
        } )

        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with ID ${req.params.id}`,404)
             );

         
        }
        res.status(200).json({
            success:true, 
            data:bootcamp
        })
        
});

//@desc   delete a single  bootcamps
//@route  DELETE/api/v1/bootcamps/:id
//@access Private
exports.deleteBootcamp =asyncHandler( async (req,res,next) => {
    // try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)

        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with ID ${req.params.id}`,404)
             );

        }
        res.status(200).json({
            success:true, 
            data:{}
        })
        
 });


//@desc   get bootcamps within a radius
//@route  GET/api/v1/bootcamps/RADIUS/:zipcode/:distance
//@access Private


exports.getBootcampsInRadius = asyncHandler(async(req,res,next) => {
    const {zipcode,distance} =  req.params;

    const loc = await geocoder.geocode(zipcode)
    // console.log(loc,distance)
    // var log = []
    const log=[loc[0].longitude,loc[0].latitude ]
    // const lng  =
    console.log(log)

    const radius = distance / 6371
    const bootcamps = await Bootcamp.find({
        location : {coordinates:
        {$geoWithin:{
            $centerSphere :[log,radius],
        },
    },
}
  
    });
    res.status(200).json({
        succes : true,
        count : bootcamps.length,
        data : bootcamps

    })
});


//@desc   UPLOAD photo for bootcamps
//@route  PUT/api/v1/bootcamps/:id/photo
//@access Private
exports.bootcampPhotoUpload =asyncHandler( async (req,res,next) => {
  
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return next(
                new ErrorResponse(`Bootcamp not found with ID ${req.params.id}`,404)
             );

            }

        if(!req.files){
            return next(
            new ErrorResponse(`Please upload a File `,404)
            )
        };

        // console.log(
        const file = req.files.file


        // check file is a image
        if(!file.mimetype ==='image'){
            return next(
                new ErrorResponse(`please upload a image file`,400 )
            )
        };

        //CHECK FILE SIZE
        if(file.size > process.env.MAX_FILE_UPLOAD){
            return next(
                new ErrorResponse(`please upload file size less than ${process.env.MAX_FILE_UPLOAD} bytes`,400)
            )
        };

        //create custom filename
        file.name = `photos_${bootcamp.id}${path.parse(file.name).ext}`;
        

        file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err => {
            if (err){
                console.log(err)
                return next (
                    new ErrorResponse (`problem with file uoload`,500)
                )
            }
            await Bootcamp.findByIdAndUpdate(req.params.id ,{photo : file.name});
            
            res.status(200).json({
                success:true,
                data:file.name
    
            })
        });      
});


