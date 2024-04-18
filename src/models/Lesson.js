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
        maxLength: [100, 'Topic exceeds the maximum allowed length of 100.'],
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "rejected", "cancelled", "confirmed", "finished"],
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