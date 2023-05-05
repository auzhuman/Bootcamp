
const express = require("express");
const {getBootcamps,
    getBootcamp,
    updateBootcamp,
    deleteBootcamp,
    createBootcamp,
    getBootcampsInRadius} = require("../controllers/bootcamps");
const router = express.Router();

router.route("/").get(getBootcamps)
                 .post(createBootcamp);

router.route("/:id").get(getBootcamp)
                    .put(updateBootcamp)
                    .delete(deleteBootcamp)
                    
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius)
// router.route("/radius/:long/:lat/:distance").get(getBootcampsInRadius)

                    
module.exports = router;





//routes
// router.get("/",(req,res) => {
//     // res.json({name:"hello from express"});
//     res.status(400).json({success:false});
// })
// router.get("/",function(req,res){
//     res.status(200).json({success:true,msg : 'showing all bootcamps'})
// })

// router.post("/",(req,res) => {
//     res.status(200).json({success : true , msg : "create bootcamp"})
// })
// router.put("/:id",(req,res) => {
//     res.status(200).json({success : true,
//            bootcampId: req.params.id ,
//            msg : "update bootcamp "+req.params.id })
// })

// router.delete("/:id",(req,res) => {
//     res
//     .status(200)
//     .json({success : true ,
//           bootcampId: req.params.id,
//           msg : "delete bootcamp"})
// })

