const User = require('../models/User');
const Post = require('../models/Post');

// const isOwner = (req,res,next) => {

//     Post.findById(req.params.postId)
//         .then((foundPost) => {
//             console.log("IDS ====>", req.user._id, foundPost)
//             console.log(req.params.postId)
//             if(req.user._id === foundPost.owner.toString()) {
//                 next()
//             } else {
//                 return res.status(401).json({message: "Validation Error"})
//             }
//         })

//         .catch((err) => {
//             console.log(err)
//             next(err)
//         })
// }

const isOwner = async (req, res, next) => {
    const {postId}= req.params
    try{ 
       const post = await  Post.findById(postId)
       if(post.owner.toString() !== req.user._id){
        return res.status(401).json({msg: "you are not the owner ):"})
       }
       next()
    }
    catch(err){
        console.log(err)
        next(err)
    }
}

module.exports = isOwner