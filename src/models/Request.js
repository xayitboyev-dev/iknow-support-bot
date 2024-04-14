const { model, Schema } = require('mongoose');

const requestSchema = new Schema({
    userId: {
        type: Number,
        required: true,
    },
    data: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        enum: ["cancelled", "confirmed", "pending"],
        default: "pending"
    },
});

module.exports = model('request', requestSchema);