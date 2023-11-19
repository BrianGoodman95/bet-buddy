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

import connectDB from '../connect.js';
import Bet from '../../models/Bet.js';
import Leg from '../../models/Leg.js';

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);

        // Fetch all documents from the Bets collection
        const bets = await Bet.find();
        console.log(bets.length)
        // Iterate over each bet and create a new Leg with the modified schema
        for (const bet of bets) {
            const legStatus = bet.betStatus === "Unsettled" ? "Open" : bet.betStatus;
            const leg = new Leg({
                legDescription: bet.eventDescription, // Use the eventDescription from the bet
                event_id: null, // Provide the appropriate value or leave as null
                subject: '', // Provide the appropriate value
                timeFrame: '', // Provide the appropriate value
                metric: '', // Provide the appropriate value
                selection: '', // Provide the appropriate value
                metricMinValue: 0, // Provide the appropriate value
                metricMaxValue: 0, // Provide the appropriate value
                odds: bet.odds,
                stake: bet.wager, // Use the wager from the bet
                status: legStatus,
                createdBy: bet.createdBy, // Use the user from the bet
            });

            // Save the new Leg
            await leg.save();

            // Update the existing Bet with the leg_ids
            bet.leg_ids = [leg._id]; // Assuming you want to store the reference to the newly created Leg
            bet.creditStake = 0;
            bet.totalStake = bet.wager;
            await bet.save();
        }

        console.log(`${bets.length} bets migrated to legs with updated schema.`);
        console.log('Success!')
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

start();

