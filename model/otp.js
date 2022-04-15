const { Schema, model } = require("mongoose");

const Otp = Schema ({
    email: {
        type: String,
        required: true
    },

    otp: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now, index: { expires: 15 }
    }

}, { timestamps: true })

module.exports.Otp = model("Otp", Otp);