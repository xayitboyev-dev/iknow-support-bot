const { branches } = require("../config/config.json");
const { model, Schema } = require('mongoose');

const userSchema = new Schema({
    full_name: {
        type: String,
        maxLength: [40, 'Topic exceeds the maximum allowed length of 40.'],
    },
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
        default: function () {
            // Check if user role is USER
            if (this.role === 'USER') return "pending";
        }
    },
    ratings: {
        type: Object,
        default: function () {
            // Check if user role is TEACHER
            if (this.role === 'TEACHER') return { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 10: 2 };
        }
    }
});

module.exports = model('user', userSchema);