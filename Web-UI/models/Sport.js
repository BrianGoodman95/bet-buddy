import mongoose, { Schema } from "mongoose";

export const SportSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the sport name'],
        maxlength: 50,
    },
    league: {
        type: String,
        required: [true, 'Please provide the sport league'],
        maxlength: 50,
        unique: true,
    }
},
{ timestamps: true }
);

export default mongoose.model('Sport', SportSchema);