const { branches } = require("../config/config.json");
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    first_name: String,
    last_name: String,
    username: String,
    level: String,
    phone: String,
    id: {
        type: Number,
        unique: true,
        sparse: true // Allows null values while enforcing uniqueness for non-null values
    },
    active: {
        type: Boolean,
        default: true,
    },
    image: {
        type: String,
    },
    ielts: {
        type: String,
    },
    role: {
        type: String,
        default: 'USER'
    },
    branch: {
        type: String,
        default: function () {
            // Check if user role is TEACHER
            if (this.role === 'TEACHER') return branches[0];
        }
    },
    status: {
        type: String,
        enum: ["activated", "pending"],
        function () {
            // Check if user role is TEACHER
            if (this.role === 'USER') return "pending";
        }
    },
    ratings: {
        type: Schema.Types.Mixed,
        // A mixed type object to handle ratings. Each star level is represented in the ratings object
        1: Number, //  the key is the weight of that star level
        2: Number,
        3: Number,
        4: Number,
        5: Number,
        default: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 5 }
    }
});

module.exports = model('user', userSchema);