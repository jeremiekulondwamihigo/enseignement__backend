const express = require("express");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error")
const cors = require("cors")
const bodyParser = require("body-parser")
const expressSession = require("express-session");
const MongodbSession = require("connect-mongodb-session")(expressSession);
const { MONGODB_URL } = require("./config/data")
const path = require("path")

connectDB();
const app = express();
app.use(cors())

app.use(express.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({limit:'50mb', extended : true }))
app.use(bodyParser.json());


// app.use("/api/auth", require("./Routes/auth"));
// app.use("/api/private", require("./Routes/private"));
// app.use("/bulletin/read", require("./Routes/Read"))
// app.use("/bulletin/create", require("./Routes/Create"))
// app.use("/bulletin/delete", require("./Routes/Delete"))
// app.use("/bulletin/update", require("./Routes/Update"))

// app.use("/imgagent", express.static(path.resolve(__dirname, "agentImages")))



app.get("/", (req, res)=>{
  res.send({
    "message":"Merci seigneur"
  })
})

//Error Handler  ()
app.use(errorHandler);



const PORT = process.env.PORT || 9002;
app.listen(PORT, ()=>console.log("server running "+PORT))

// process.on("unhandledRejection", (err, promise)=>{
//   console.log(`Logged Error :${err}`);
//   // server.close(()=>process.exit(1));
// })
