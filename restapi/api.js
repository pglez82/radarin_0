const express = require("express")
const User = require("./models/users")
const router = express.Router()

// Get all users
router.get("/users/list", async (req, res) => {
    console.log("users lists")
	const users = await User.find({})
	res.send(users)
})

//register a new user
router.post("/users/add", async (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    //Check if the device is already in the db
    let user = await User.findOne({ email: email })
    if (user)
        console.log("This user is repeated")
    else{
        user = new User({
            name: name,
            email: email,
        })
    }
	await user.save()
	res.send(user)
})

module.exports = router