var express = require('express');
var router = express.Router();

const User = require ('../models/User');
const isAuthenticated = require('../middleware/isAuthenticated');
const isProfileOwner = require('../middleware/isProfileOwner');


router.get('/user-details/:userId', (req, res , next) => {
  const { userId } = req.params

  User.findById(userId)
  .then((foundUser) => {
    res.json(foundUser)
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })

})

router.post('/user-update/:userId', isAuthenticated, isProfileOwner, (req, res, next) => {

  const { userId } = req.params

  const { fullName, username, email, password } = req.body

  User.findByIdAndUpdate(
    userId,
    {
      fullName,
      username,
      email,
      password,

    },

    { new: true }
  )
  .then((updatedUser) => {
    res.json(updatedUser)
  })
  .catch((err) => {
    console.log(err)
    next(err)
  })

})


router.get('/delete/:userId', isAuthenticated, isProfileOwner, (req, res, next) => {

  const { userId } = req.params

    User.findByIdAndDelete(userId)
      .then((deletedUser) => {

        Post.deleteMany({
          owner: deletedUser._id
        })
          .then((deletedPosts) => {
            console.log("Deleted Posts", deletedPosts)
            res.json(deletedUser)
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
