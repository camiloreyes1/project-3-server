const { Schema, model, Types } = require('mongoose')

const userSchema = new Schema(
    {
        fullName: String,

        username: {type: String,
                    unique: true,
                    required: true},

        email: {type: String,
                unique: true,
                required: true},

        password: { type: String,
            required: true },
        // likes:[ {type:Types.ObjectId, ref: "Post" }]

    },

    {
        timeseries: true
    }
)

module.exports = model("User", userSchema);