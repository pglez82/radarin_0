const express = require("express")
const mongoose = require("mongoose")
const api = require("./api") 

function connect(){
    mongoose.connect("mongodb://localhost:27017", { useNewUrlParser: true,useUnifiedTopology: true }).then(() => {
        const app = express()
        app.use(express.json())
        app.use("/api", api)
        app.listen(5000, () => {
            console.log("Server has started!")
        })
    })
}

// Connect to MongoDB database, the wait is for giving time to mongodb to finish loading
setTimeout(connect,5000)