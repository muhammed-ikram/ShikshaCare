const mongoose = require('mongoose');



const userSchema = mongoose.Schema({
    username: String,
    email: { type: String, unique: true },
    password: String,
    authProvider: {
        type: String,
        default: 'local'
    },
    googleId: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'post'
        }
    ],
    profilepic: {
        type: String,
        default: "default.jpg"
    },
    profileCompleted: {
        type: Boolean,
        default: false
    }
});

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;