const { model, Schema } = require('mongoose');
const { branches } = require("../config/config.json");

const lessonSchema = new Schema({
    type: {
        type: String,
        enum: ["break", "lesson"]
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    teacher: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    topic: {
        type: String,
        maxLength: [100, 'Topic exceeds the maximum allowed length of 100.'],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "rejected", "cancelled", "confirmed", "finished"],
        default: "pending"
    },
    branch: {
        type: String,
        enum: branches,
        default: branches[0]
    },
    date: {
        type: String,
        required: true,
    },
    time: {
        type: String,
        required: true,
    }
}, { timestamps: true });

module.exports = model('lesson', lessonSchema);