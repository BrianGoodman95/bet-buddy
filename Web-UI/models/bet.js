import mongoose, { Schema } from "mongoose";
import { LegSchema } from "./Leg.js";

const BetSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please provide the user']
        },
        leg_ids: [  // Change field name to leg_ids and make it an array
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Leg'
            }
        ],
        sportsBook: {
            type: String,
            maxlength: 20,
            default: 0,
        },
        totalOdds: {
            type: Number,
            required: [true, "Please provide the total odds"],
            maxlength: 10
        }, // Total odds for the bet (for parlay bets)
        creditStake: {
            type: Number,
            maxlength: 20,
            default: 0,
        }, // Amount staked with credits or bonus
        totalStake: {
            type: Number,
            required: [true, "Please provide the total stake"],
            maxlength: 10
        }, // Total stake for the bet (for parlay bets) - Money + Credits
        oddsBoost: {
            type: Number,
            maxlength: 20,
            default: 0,
        }, // Any odds boost applied to the bet
        expectedBetReturn: {
            type: Number,
            maxlength: 20,
            default: 0,
        }, // Expected return for the bet
        bonusReturn: {
            type: Number,
            maxlength: 20,
            default: 0,
        }, // Return from bonus or promotion
        betReturn: {
            type: Number,
            required: [true, "Please provide the payout returned"],
            maxlength: 20,
            default: 0,
        }, // Actual return for the bet
        status: {
            type: String,
            enum: ["Won", "Lost", "Push", "Live", "Unsettled"],
            default: 'Unsettled',
        },
    },
    { timestamps: true }
);

// const BetSchema = new mongoose.Schema(
//     {
//         eventCategory: {
//             type: String,
//             required: [true, "Please provide or select a category for the event the bet is for"],
//             maxlength: 50
//         },
//         betSource: {
//             type: String,
//             maxlength: 30
//         },
//         eventDescription: {
//             type: String,
//             required: [true, "Please provide or select a description for the event the bet is for"],
//             maxlength: 200
//         },
//         eventId: {
//             type: String,
//             maxlength: 30
//         },
//         customEventId: {
//             type: String,
//             default: Schema.Types.ObjectId,
//             maxlength: 50
//         },
//         sportsBook: {
//             type: String,
//             required: [true, "Please provide or select a sports book"],
//             maxlength: 50
//         },
//         odds: {
//             type: Number,
//             required: [true, "Please provide or select odds"],
//             maxlength: 10
//         },
//         pick: {
//             type: String,
//             required: [true, "Please provide or select a pick"],
//             maxlength: 100
//         },
//         wager: {
//             type: Number,
//             required: [true, "Please provide a wager"],
//             maxlength: 10
//         },
//         betStatus: {
//             type: String,
//             // enum: ["Won", "Lost", "Push", "Live", "Unsettled"],
//             // default: "Unsettled"
//         },
//         betLocation: {
//             type: String,
//             // default: 'my city',
//             // required: true
//         },
//         createdBy: {
//             type: mongoose.Types.ObjectId,
//             ref: 'User',
//             required: [true, 'Please provide the user']
//         },
//     },
//     { timestamps: true }
// )

export default mongoose.model('Bet', BetSchema)

"65126d903dff79a07a3b93c8", "65126d3999b5b23669c70239", "65126f0828cd9b071d356fb0", "65126f8628cd9b071d356fb4"