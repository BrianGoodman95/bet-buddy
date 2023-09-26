import mongoose, { Schema } from "mongoose";
// import { SportSchema } from "./Sport.js";
// import  Sport from './Sport.js'; // Import the 'User' model

export const EventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide the event name'],
        maxlength: 200,
    },
    description: {
        type: String,
        required: [false, 'Please provide the sport type'],
        maxlength: 50,
    },
    externalEventId: {
        type: String,
        default: Schema.Types.ObjectId,
        maxlength: 50
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    homeTeam: { // The type of leg (spread, total, td scores, points at half, passing yards, etc)
        type: String,
        required: [false, 'Please provide the home team for the event'],
        maxlength: 50,
    },
    awayTeam: { // The type of leg (spread, total, td scores, points at half, passing yards, etc)
        type: String,
        required: [false, 'Please provide the away team for the event'],
        maxlength: 50,
    },
    location: { //The stadium, arena, etc the event is happening at
        type: String,
        maxlength: 100,
    },
    sport_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Sport' // Reference to the 'Sport' collection
    },
    status: {
        type: String,
        enum: ["Upcoming", "Live", "Completed"],
        default: "Upcoming"
    }
},
{ timestamps: true }
);

export default mongoose.model('Event', EventSchema);