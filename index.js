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
const DeleteRoute = require("./Routes/Delete")

connectDB();
const app = express();
app.use(cors())

app.use(express.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}))
app.use(bodyParser.json());


app.use("/api/private", privateRoute);
app.use("/bulletin/update", updateRoute)
app.use("/bulletin/read", readRoute)
app.use("/bulletin/create", createRout)
app.use("/bulletin/delete", DeleteRoute)

app.use("/imgagent", express.static(path.resolve(__dirname, "agentImages")))
app.set("view engine", 'ejs')
app.use('/assets', express.static('public'))

// Error Handler  ()
app.use(errorHandler);


const accountSid = "AC612b2d61cd96d532ac1a7ab6d9e4494b";
const authToken = "a57c67bea7ecd534e82d1752c6b60e98";
const client = require('twilio')(accountSid, authToken);

app.post("/twilio", (req, res) => {

    client.messages.create({body: 'Exaucé', from: '+13854386517', to: '+243979527648'})
})


app.get("/", (req, res) => {
    res.render("LoginScreen")
})


const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => console.log("server running " + PORT))

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error :${err}`);

    server.close(() => process.exit(1));

})
