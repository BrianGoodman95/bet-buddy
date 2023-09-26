import mongoose, { Schema } from "mongoose";

export const LegSchema = new mongoose.Schema({
    legDescription: { // The type of leg (spread, total, td scores, points at half, passing yards, etc)
        type: String,
        required: [true, 'Please provide a description of this leg of the bet'],
        maxlength: 100,
    },
    event_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event' // Reference to the 'Sport' collection
    },
    //
    // These fields should comprise the leg description in discret form. When we're ready on the front end, we can switch to storing the leg in these chunks instead of a free-form description
    //
    subject: { // Who or what subject of the event the leg is abot (boh teams, single team, group of players, player, coach, singer, etc)
        type: String,
        // required: [true, 'Please provide the subject'],
        maxlength: 100,
    },
    timeFrame: { // The time window relevant to the leg - match, 1st quarter, 2023 season
        type: String,
        // required: [true, 'Please provide the time frame'],
        maxlength: 100,
    },
    metric: { // The thing we care about in the leg
        type: String,
        // required: [true, 'Please provide the metric'],
        maxlength: 100,
    },
    // There are 2 types of legs - Timing and Quantity
    // Timing legs are if something will happen at a particular time/order, and are selcted by Yes/No
    // Quantity legs are how much of something there will be, and are selected by Over/Under/Between/Exactly
    selection: { // How the leg predicts the value of the metric will actually be relative to the min/max value
        type: String,
        enum: ["Yes", "No", "Over", "Under", "Between", "Exactly", ""],
        required: false,
        maxlength: 100,
    },
    // Metric min/max values are only needed for "quantity" legs where the selection will be over/under/between
    // Not needed for timing lefs where the selection is Yes/No (barkley to score the first td of the game)
    metricMinValue: { // The lower value of the thing we care about in the leg
        type: Number,
        // required: [true, 'Please provide the metricMinValue'],
        maxlength: 30,
    },
    metricMaxValue: { //  The lower value of the thing we care about in the leg
        type: Number,
        // required: [true, 'Please provide the metricMaxValue'],
        maxlength: 30,
    },
    //
    // End of discret fields of leg description. Once implemented, we could probably construct the description automatically from the values above
    //
    odds: {
        type: Number,
        required: [true, 'Please provide the odds'],
        maxlength: 10,
    },
    stake: {
        type: Number,
        required: [true, 'Please provide the stake'],
        maxlength: 10,
    },
    status: {
        type: String,
        enum: ["Open", "Won", "Lost", "Push", "Live"],
        default: "Open"
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide the user']
    },
},
{ timestamps: true }
);

export default mongoose.model('Leg', LegSchema);