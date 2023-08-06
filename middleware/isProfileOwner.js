const isProfileOwner = (req,res,next) => {

    if(req.user._id === req.params.userId) {
        next()
    } else {
       return res.status(401).json({message: "Not your profile"})
    }

    
}

module.exports = isProfileOwner