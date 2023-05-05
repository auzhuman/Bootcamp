const asyncHandler = require("../middlewares/async")
const ErrorResponse = require("../utils/errorResponse")    
const Bootcamp = require("../models/Bootcamp");
const geocoder = require("../utils/geocoder")
//@desc   Get all bootcamps
//@route  GET/api/v1/bootcamps
//@access Public
exports.getBootcamps = asyncHandler( async(req,res,next) => {
    // try {
        const bootcamp = await Bootcamp.find();
        res
        .status(200)
        .json({
            succes:true,
            noOfbootcamp :bootcamp.length,
            data:bootcamp
        })
        
    // } catch (error) {
        // next(error)
        // res.status(400).json({success:false})
        
    // }
   
    // res.status(200).json({success:true,msg : 'showing all bootcamps'})
});


//@desc   Get a single  bootcamps
//@route  GET/api/v1/bootcamps/:id
//@access Public
exports.getBootcamp = asyncHandler( async(req,res,next) => {
    // try {
        const bootcamp = await Bootcamp.findById(req.params.id);
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
        
    // } catch (error) {
    //     next(error)


    //     // next(new ErrorResponse(`Bootcamp not found with ID ${req.params.id}`,404))

    //     // res.status(400).json({succes:false})       
    // }
              
  
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

            // res.status(400).json({
            // succes:false
            // })
        }
        res.status(200).json({
            success:true, 
            data:bootcamp
        })
        
    // } catch (error) {
    //     next(error)

    //     // res.status(400).json({succes:false})       
    // }
    // res.status(200).json({success:true,msg : `update bootcamp ${req.params.id}`})
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

            // res.status(400).json({
            // succes:false
            // })
        }
        res.status(200).json({
            success:true, 
            data:{}
        })
        
    // } catch (error) {
        // next(error)

        // res.status(400).json({succes:false})       
    // }
    // res.status(200).json({success:true,msg : `delete bootcamp ${req.params.id}`})
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
}) 
