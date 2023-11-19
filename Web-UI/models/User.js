import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const UserSchema = new mongoose.Schema({
    name: {
        type: String, 
        required: [true, "Please provide name"], 
        minlength:1,
        maxlength: 20,
        trim: true
    },
    email: {
        type: String, 
        required: [true, "Please provide email"], 
        validator: {
            //uses imported library that does the validation and error handling
            validator: validator.isEmail,
            message: "Please provide a valid email"
        },
        unique: true
    },
    password: {
        type: String, 
        required: [true, "Please provide password"], 
        minlength: 6,
        select: false, // exclude it in responses by default unless overridden
    },
    location: {
        type: String, 
        trim: true,
        minlength:1,
        maxlength: 20,
        default: "my city"
    },
    sportsBooks: {
        type: [String],
        enum: ["Bet365", "Fanduel", "The Score", "DraftKings", "Proline"],
        default: ["Bet365"]
    },
    OddsUnits: {
        type: String,
        enum: ["Decimal", "American"],
        default: "Decimal"
    },
    appTheme: {
        type: String,
        enum: ["Light", "Dark"],
        default: "Light"
    },
    favTeams: {
        type: [String]
    },
});

UserSchema.pre('save', async function() { // not every method triggers this though
    if (!this.isModified('password')) 
        return
    const salt = await bcrypt.genSalt(10); // # extra characters to add to the hash
    this.password = await bcrypt.hash(this.password, salt);
}) 

UserSchema.methods.createJWT = function () {
    console.log(this)
    return jwt.sign({userId:this._id}, process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

// this defines the schema for the User database 
// this will also create a collection called "users" in the database if it doesn't exist
export default mongoose.model("User", UserSchema);
