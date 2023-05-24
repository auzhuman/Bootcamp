const express = require("express");
const { getCourses,
        getCourse,
        createCourse,
        updateCourse,
        deleteCourse
        }= require("../controllers/courses");

const Course = require("../models/Course")
const advancedResults = require("../middlewares/advancedResult")


const router = express.Router({mergeParams : true});

router.route("/")
                .get(advancedResults(Course,{
                    path : "bootcamp",
                    select : "name description"}
                     )
                    ,getCourses)
                .post(createCourse)

//                  .post(createBootcamp);

router.route("/:id").get(getCourse)
                    .put(updateCourse)
                    .delete(deleteCourse)

module.exports = router;  