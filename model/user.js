const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");    

const userSchema = Schema({
    email: {
        type: String,
        required: true
    }
}, { timestamps: true });

userSchema.methods.generateJWT = () => {
        const token = jwt.sign({
            _id: this._id,
            email: this.email
        }, process.env.JWT_SECRET_KEY, { expiresIn: "30min" })
}

module.exports.User = model("User", userSchema);