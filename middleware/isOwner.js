const User = require('../models/User');
const Post = require('../models/Post');

const isOwner = (req,res,next) => {

    Post.findById(req.params.postId)
        .then((foundPost) => {
            console.log("IDS ====>", req.user._id, foundPost)
            if(req.user._id === foundPost.owner.toString()) {
                next()
            } else {
                return res.status(401).json({message: "Validation Error"})
            }
        })

        .catch((err) => {
            console.log(err)
            next(err)
        })
}

module.exports = isOwner