var express = require('express');
var router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');
const Comments = require ('../models/Comments')

const isAuthenticated = require('../middleware/isAuthenticated');
const isOwner = require('../middleware/isOwner');

router.get('/', isAuthenticated, (req,res,next) => {
    Post.find()

    .populate('owner likes')
        .populate({
            path: 'comments',
            populate: { path: 'author' }
    })
    .then((allPosts) => {
        res.json(allPosts)
    })

    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.post('/new-post', isAuthenticated, (req,res,next) => {

    const {owner, image, likes, caption} = req.body

    Post.create({
        owner: req.user._id,
        image,
        likes,
        caption,
    })
    .then((newPost) => {
        res.json(newPost)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.post('/edit/:postId', isAuthenticated, isOwner, (req, res, next) => {
    const {postId} = req.params
    const {caption} = req.body

    Post.findByIdAndUpdate(
        postId,
        {
            caption
        },
        {
            new:true
        })
        .populate('owner likes')
        .populate({
            path: 'comments',
            populate: { path: 'author' }
        })
        .then((updatedPost) => {
            res.json(updatedPost)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })  
})

router.post('/delete-post/:postId', isAuthenticated, isOwner, (req,res,next) => {

    const {postId} = req.params

    Post.findOneAndDelete(postId)
    .then((deletedPost) => {
        res.json(deletedPost)
    })

    .catch((err) => {
        console.log(err)
        next(err)
    })
})

router.get('/addLike/:postId', isAuthenticated, (req, res, next) => {

    const { postId } = req.params
    const userId = req.user._id

    Post.findByIdAndUpdate(postId,
        {
            $push: { likes: userId }
        },
        {
            new: true
        })
        .populate('owner likes')
        .populate({
            path: 'comments',
            populate: { path: 'author' }
        })
        .then((likedPost) => {
            res.json(likedPost)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.get('/deleteLike/:postId', isAuthenticated, (req, res, next) => {

    const { postId } = req.params
    const userId = req.user._id

    Post.findByIdAndUpdate(postId,
        {
            $pull: { likes: userId }
        },
        {
            new: true
        })
        .populate('owner likes')
        .populate({
            path: 'comments',
            populate: { path: 'author' }
        })
        .then((likedPost) => {
            res.json(likedPost)
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.get('/post-details/:postId', isAuthenticated, (req, res, next) => {

    const {postId} = req.params
    
    Post.findById(postId) 
    .populate('owner') 
    .then((yourPost) => {
        console.log("Post: ", yourPost)
        res.json(yourPost)
    })
    .catch((err) => {
        console.log(err)
        next(err)
    })
    

})

module.exports = router;
