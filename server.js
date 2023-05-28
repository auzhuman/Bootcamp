const path = require("path")
const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan'); 
const connectdb = require('./config/db'); 
const fileupload = require('express-fileupload')
const errorhandler = require("./middlewares/error")
const colors = require("colors")
//load env vars 
dotenv.config({ path:"./config/config.env"});

//connect db
connectdb();

const app = express();


//body parser
app.use(express.json())

//route
const bootcamps = require("./routes/bootcamps")
const courses = require("./routes/courses")
const auth = require("./routes/auth")


//logger middleware
if(process.env.NODE_ENV==='development'){
 app.use(morgan("dev"));
}

//file uploader 
app.use(fileupload());



//set static folder
app.use(express.static(path.join(__dirname,'public')));

//mount routers
app.use("/api/v1/bootcamps",bootcamps);
app.use("/api/v1/courses",courses);
app.use("/api/v1/auth",auth);  


//mount middlewares
app.use(errorhandler)



const PORT = process.env.PORT || 5000; 

const server = app.listen(PORT,
    console.log(`LIstening to port ${process.env.PORT} in ${process.env.NODE_ENV} environment`.yellow)
);

process.on("unhandledRejection",(err,Promise) => {
    console.log(`Error : ${err.message}`);
    server.close(()=> process.exit(1));
})


 
