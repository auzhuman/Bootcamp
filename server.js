const express = require("express");
const dotenv = require("dotenv");
const morgan = require('morgan'); 
const connectdb = require('./config/db'); 
const errorhandler = require("./middlewares/error")
//load env vars 
dotenv.config({ path:"./config/config.env"});

//connect db
connectdb();

const app = express();


//body parser
app.use(express.json())

//route
const bootcamps = require("./routes/bootcamps")

//logger middleware
if(process.env.NODE_ENV==='development'){
 app.use(morgan("dev"));
}

//mount routers
app.use("/api/v1/bootcamps",bootcamps);

//mount middlewares
app.use(errorhandler)



const PORT = process.env.PORT || 5000; 

const server = app.listen(PORT,
    console.log(`LIstening to port ${process.env.PORT} in ${process.env.NODE_ENV} environment`)
);

process.on("unhandledRejection",(err,Promise) => {
    console.log(`Error : ${err.message}`);
    server.close(()=> process.exit(1));
})


 
