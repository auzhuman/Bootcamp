const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
    title : {
        type : String,
        trim:true,
        required : [true,"please add a title"]
    },
    description : {
        type : String,
        required : [true,"please add a description"]
    },
    weeks : {
        type : String,
        required : [true,"please add a duration of weeks"]
    },
    tuition : {
        type : Number,
        required : [true,"please add a tuition cost "]
    },
    minimumSkill : {
        type : String,
        required : [true,"please add a minimumSkill"],
        enum : ["beginner","intermediate","advanced"],

    },
    scholarshipsAvailable :{
        type: Boolean,
        default : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    } ,
    bootcamp: {
        type : mongoose.Schema.ObjectId,
        ref : "Bootcamp",
        required : true
    }
});

CourseSchema.statics.getAverageCost = async function(bootcampId){
    console.log("calculating average cost".blue)

    const obj =  await this.aggregate([
        {
            $match:{bootcamp : bootcampId}
        },
        {
            $group : {
                _id : '$bootcamp',
                averageCost : { $avg : '$tuition'}
                
            } 
        }
    ]) ;
    // console.log(obj);
    try {
        await this.model("Bootcamp").findByIdAndUpdate(bootcampId,{
            averageCost : Math.ceil(obj[0].averageCost / 10) * 10
            
        })
    } catch (error) {
        console.log(error)
        
    }

};



// call getAveragecost after save

CourseSchema.post('save',function(){
    this.constructor.getAverageCost(this.bootcamp)

})


// call getAveragecost befor remove

CourseSchema.pre('remove',function(){
    this.constructor.getAverageCost(this.bootcamp)

})
module.exports = mongoose.model("Course",CourseSchema)

 