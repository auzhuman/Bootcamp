const slugify = require('slugify')
const mongoose = require('mongoose')
const geocoder = require("../utils/geocoder")


const BootcampSchema = new mongoose.Schema({
    name : {
        type:String,
        required : [true,'please add name '],
        unique : true,
        trim : true,
        maxlength : [50,'name between 50 char']
    },
    slug : String,

    description : {
        type : String,
        required : [true,'please add description '],  
        maxlength : [500,'desc between 500 char']
    },
    website : {
        type : String,
        match : [/^(?:(?:https?|ftp):\/\/)?(?:www\.)?[a-z0-9\-\.]+\.[a-z]{2,}(?:\/.*)?$/,'use valid url']

    }, 
    phone : {
        type : String,
        maxlength : [20,"between 20 chars"]
    },
    email : {
        type : String,
        match : [/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,'use valid email']
    },
    address : {
        type : String,
        required : [true," please provide an address"] 
    },
    location: {
          type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'] // 'location.type' must be 'Point'
            // required: true
          },
          coordinates: {
            type: [Number],
            // required: true,
            index : '2dsphere'
          },
          formattedAddress : String,
          streetNumber:String,
          street : String, //given
          city: String, //notgiven
          state:String, //notgiven
          zipcode : String, 
          country : String
          
    
    },
    careers : {
        type : [String],
        required : true,
        enum : [
            "Web Development",
             "UI/UX",
             "Business",
             "Mobile Development",
             "Data Science",
             "other"
  
        ]
    },
    averageRating : { 
        type : Number,
        min : [ 1,"Rating must be at least 1"],
        max : [ 10,"Rating must be at most 10"]
    
    },
    averageCost :Number,
    photo : {
        type : String ,
        default :"no_photos.jpg"
    },
    housing : {
        type : Boolean,
        default : false
    },
    jobAssistance : {
        type : Boolean,  
        default : false
    },
    jobGuarantee : {
        type : Boolean,
        default : false
    },
    acceptGi : {
        type : Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    }

},{
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
})


// implement slugify
BootcampSchema.pre("save",function(next){
    this.slug = slugify(this.name,{lower :true}) 
    // console.log("slugify ran",this.name)
    next();
});


// GECODE and create location field
BootcampSchema.pre("save",async function(next){
 const loc = await geocoder.geocode(this.address);
 
//  console.log(loc)
 this.location = { 
     type : "point",
     coordinates : [loc[0].longitude,loc[0].latitude],
     formattedAddress : loc[0].formattedAddress,
     streetNumber : loc[0].streetNumber,
     street : loc[0].streetName,
    
     city : loc[0].city,
     state: loc[0].administrativeLevels.level1long,
     zipcode : loc[0].zipcode,
     country : loc[0].countryCode,
 }
//  console.log("this is location",this.location)
 this.address = undefined 
 next();
});

//Reverse populate with virtuals
BootcampSchema.virtual('courses',{
    ref : 'Course',
    localField : '_id',
    foreignField : 'bootcamp',
    justOne : false
})


module.exports = mongoose.model("Bootcamp",BootcampSchema)


