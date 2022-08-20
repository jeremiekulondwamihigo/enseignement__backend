
const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")

const readRoute = require("./Routes/Read")
const createRout = require("./Routes/Create")
const updateRoute = require("./Routes/Update")
const privateRoute = require("./Routes/private")

connectDB();
const app = express();
app.use(cors())

app.use(express.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb', extended : true }))
app.use(bodyParser.json());


app.use("/api/private", privateRoute);
app.use("/bulletin/update", updateRoute)
app.use("/bulletin/read", readRoute)
app.use("/bulletin/create", createRout)

app.use("/imgagent", express.static(path.resolve(__dirname, "agentImages")))

//Error Handler  ()
app.use(errorHandler);

const multer = require("multer");
const sharp = require("sharp")
const storage = multer.memoryStorage()
const apload = multer({storage})
const fs = require("fs")

app.post("/multer", apload.single("thumbnail"), async (req, res)=>{
  
  fs.access("./config/Images/", (err)=>{
    if(err){
      fs.mkdirSync("./config/Images/")
    }
  })
  await sharp(req.file.buffer).resize({width:300, height:300}).toFile("./config/Images/"+req.file.originalname)


})





const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, ()=>console.log("server running "+PORT))

process.on("unhandledRejection", (err, promise)=>{
  console.log(`Logged Error :${err}`);
  
  server.close(()=>process.exit(1));
  
})
