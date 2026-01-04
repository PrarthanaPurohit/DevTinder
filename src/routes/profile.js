const express = require('express');
const {userAuth} = require ("../middleware/auth");
const {validateEditProfileData} = require("../utils/validation");



const profileRouter = express.Router();

//get profile
profileRouter.get("/profile/view",userAuth, async(req, res) => {
    try{
    const user = req.user;
    res.send(user);
}catch(err){
    res.status(500).send("Error fetching profile: " + err.message);
}
});

//edit profile
profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
    try{
        if(!validateEditProfileData(req)){
            throw new Error("Invalid edit request")
        }
        const loggedInUser = req.user;
         
        //patch data
        Object.keys(req.body).forEach((key) => (
            loggedInUser[key] = req.body[key]));
        
        await loggedInUser.save();
        
        res.json({message: `${loggedInUser.firstName}, your profile updated successfully`, data: loggedInUser});
        }
        catch(err){
        res.status(400).send("Error:" + err.message)
    }

});

module.exports = profileRouter;