import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
// Get the current module's URL
const currentModuleURL = import.meta.url;
// Convert the URL to a file path
const __filename = fileURLToPath(currentModuleURL);
const __dirname = path.dirname(__filename);
// Determine the path to the .env file relative to this script
const envPath = path.resolve(__dirname, '../../.env'); // Adjust the path as needed
// Load environment variables from the specified path
dotenv.config({ path: envPath });

import connectDB from '../db/connect.js';
import Bet from '../models/Bet.js'; // Update the import to use Bet model
import Leg from '../models/Leg.js';
import mongoose from 'mongoose';

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);
        await Bet.deleteMany({});
        // Fetch all documents from the Legs collection
        const legs = await Leg.find();
        console.log(legs.length);

        // Iterate over each leg and create a new Bet with the modified schema
        for (const leg of legs) {
            const betStatus = leg.legStatus === "Open" ? "Unsettled" : leg.legStatus;

            const bet = new Bet({
                createdBy: leg.createdBy, // Use the createdBy from the leg
                leg_ids: [leg._id], // Store the reference to the leg in leg_ids
                sportsBook: "Fanduel", // Provide the appropriate value or leave as empty string
                totalOdds: leg.odds, // Provide the appropriate default value
                creditStake: 0, // Provide the appropriate default value
                totalStake: leg.stake, // Provide the appropriate default value
                oddsBoost: 0, // Provide the appropriate default value
                expectedBetReturn: 0, // Provide the appropriate default value
                bonusReturn: 0, // Provide the appropriate default value
                betReturn: 0, // Provide the appropriate default value
                status: betStatus, // Set the default status
            });

            // Save the new Bet
            await bet.save();

            // Update the existing Leg with the bet_ids
            // leg.bet_ids = [bet._id]; // Assuming you want to store the reference to the newly created Bet
            // await leg.save();
        }

        console.log(`${legs.length} legs migrated to bets with updated schema.`);
        console.log('Success!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();







