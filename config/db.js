const mongoose = require("mongoose");

const URL = "mongodb://localhost:27017/node_auth"
const URL_ON_LINE = "mongodb+srv://jeremie:unU82Epc6PsmN9jS@cluster0.jdnjp.mongodb.net/?retryWrites=true&w=majority"
const connectDB = async ()=>{
    await mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify : false,
        useCreateIndex : true,

    })

    console.log("MongoDB connect");
};

module.exports = connectDB;