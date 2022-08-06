const mongoose = require("mongoose");

const connectDB = async ()=>{
    await mongoose.connect("mongodb+srv://jeremie:unU82Epc6PsmN9jS@cluster0.jdnjp.mongodb.net/?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify : false,
        useCreateIndex : true,

    })

    console.log("MongoDB connect");
};

module.exports = connectDB;