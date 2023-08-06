const { Schema, model } = require('mongoose')

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

    },

    {
        timeseries: true
    }
)

module.exports = model("User", userSchema);