/*
This server file allow to start the restapi using an in-memory database
This will be handy for testing
*/


const express = require("express")
const { MongoMemoryServer } = require('mongodb-memory-server');
const cors = require('cors');
const mongoose = require("mongoose")
const api = require("../api") 



module.exports.startdb = async () => {
    mongod = new MongoMemoryServer({ instance: { port: 27017}})
    const mongo_uri =await mongod.getUri();
    console.log(mongo_uri)
    await mongoose.connect(mongo_uri, { useNewUrlParser: true,useUnifiedTopology: true })
}

module.exports.startserver = async () => {
    app = express()

    app.use(cors());
    app.options('*', cors());
    app.use(express.json())
    app.use("/api", api)

    server = await app.listen(5000)
    console.log("Server has started!")
    return app
}

module.exports.closeServer = async () => {
    await server.close()
}

module.exports.closeDB = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}

module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}