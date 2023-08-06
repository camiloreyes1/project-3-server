const { Schema, model } = require('mongoose') 

const postSchema = new Schema(

    {
        owner: {type: Schema.Types.ObjectId, ref: 'User'},
        
        image: String,

        likes: [{type: Schema.Types.ObjectId, ref: 'User'}],

        caption: String, 

        comments: [{type: Schema.Types.ObjectId, ref: 'Comment'}]

    },

    {
        timeseries: true
    }
)

module.exports = model('Post', postSchema)