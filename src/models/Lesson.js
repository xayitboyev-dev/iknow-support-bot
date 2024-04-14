const { model, Schema } = require('mongoose');

const lessonSchema = new Schema({
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
        maxLength: 1000
    },
    status: {
        type: String,
        enum: ["rejected", "confirmed", "pending"],
        default: "pending"
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