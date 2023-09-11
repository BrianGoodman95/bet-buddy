import mongoose, { Schema } from "mongoose";

const BetSchema = new mongoose.Schema(
    {
        betSource: {
            type: String,
            enum: ["Registered", "Custom"],
            default: "Custom"
        },
        eventCategory: {
            type: String,
            required: [true, "Please provide or select a category for the event the bet is for"],
            maxlength: 50
        },
        eventDescription: {
            type: String,
            required: [true, "Please provide or select a description for the event the bet is for"],
            maxlength: 200
        },
        eventId: {
            type: String,
            default: "",
            maxlength: 30
        },
        customEventId: {
            type: String,
            default: Schema.Types.ObjectId,
            maxlength: 50
        },
        sportsBook: {
            type: String,
            required: [true, "Please provide or select a sports book"],
            maxlength: 50
        },
        odds: {
            type: Number,
            required: [true, "Please provide or select odds"],
            maxlength: 10
        },
        pick: {
            type: String,
            required: [true, "Please provide or select a pick"],
            maxlength: 100
        },
        wager: {
            type: Number,
            required: [true, "Please provide a wager"],
            maxlength: 10
        },
        betStatus: {
            type: String,
            enum: ["Won", "Lost", "Push", "Live", "Unsettled"],
            default: "Unsettled"
        },
        betLocation: {
            type: String,
            default: 'my city',
            required: true
        },
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide the user']
        },
    },
    { timestamps: true }
)

export default mongoose.model('Bet', BetSchema)