import mongoose, { Schema } from "mongoose";

export const LegSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ["Spread", "MoneyLine", "Over", "Under", "Team Points", ""],
        default: "Unsettled"
    },
    event: {
        type: String,
        required: [true, 'Please provide the event'],
        maxlength: 200,
    },
},
{ timestamps: true }
);

export default mongoose.model('Leg', LegSchema);