var express = require('express');
var router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');
const Comments = require('../models/Comments')

const isAuthenticated = require('../middleware/isAuthenticated');
const isOwner = require('../middleware/isOwner');

router.get('/', isAuthenticated, (req, res, next) => {
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

router.post('/new-post', isAuthenticated, (req, res, next) => {

    const { owner, image, likes, caption } = req.body

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
    const { postId } = req.params
    const { caption } = req.body

    Post.findByIdAndUpdate(
        postId,
        {
            caption
        },
        {
            new: true
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

router.post('/delete-post/:postId', isAuthenticated, isOwner, (req, res, next) => {

    const { postId } = req.params

    Post.findByIdAndDelete(postId)
        .then((deletedPost) => {
            res.json(deletedPost)
        })

        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.get('/like-button/:postId', isAuthenticated, async (req, res, next) => {

    try {

        const { postId } = req.params
        const userId = req.user._id

        const thisPost = await Post.findById(postId)

        let likesArray = thisPost.likes.map((like) => like.toString())

        console.log("ARRAY", likesArray)

        if (likesArray.includes(userId)) {
            console.log("UNCLIKING")
            let filtered = likesArray.filter((like) => like._id === userId)
            thisPost.likes = filtered
        } else {
            likesArray.push(userId)
            thisPost.likes = likesArray
        }

        const toPopulate = await thisPost.save()
        console.log("toPopulate", toPopulate)
        const toPopulateAgain = await toPopulate.populate('owner likes')
        const newPost = await toPopulateAgain.populate({ path: 'comments', populate: { path: 'author' } })

        res.json(newPost)

    } catch (err) {
        console.log(err)
        next(err)
    }

})

router.get('/post-details/:postId', isAuthenticated, (req, res, next) => {

    const { postId } = req.params

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

router.get('/profile/:userId', isAuthenticated, (req, res, next) => {
   
        const { userId } = req.params

        User.findById(userId)
        .then((foundUser) => {
            Post.find({
                owner: foundUser._id
            })
            .then((foundPosts) => {
                res.json({ foundUser, foundPosts })
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })
        })
        .catch((err) => {
            console.log(err)
            next(err)
        })
})

router.post('/add-comment/:postId', isAuthenticated, (req, res, next) => {

    Comments.create({
        author: req.user._id,
        comment: req.body.comment
    })
        .then((createdComment) => {

            Post.findByIdAndUpdate(
                req.params.postId,
                {
                    $push: {comments: createdComment._id}
                },
                {new: true}
            )
            .populate('owner')
            .populate({
                path: 'comments',
                populate: { path: 'author'}
            })
            .then((updatedPost) => {
                console.log("Updated post")
                res.json(updatedPost)
            })
            .catch((err) => {
                console.log(err)
                next(err)
            })

        })
        .catch((err) => {
            console.log(err)
            next(err)
        })

})


module.exports = router;



