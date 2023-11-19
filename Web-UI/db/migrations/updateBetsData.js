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

import connectDB from '../db/connect.js'
import Bet from '../models/Bet.js'
import { convertAmericanToDecimal, calcExpectedBetReturn, updateBetReturn } from '../utils/calcBetAttributes.js'

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        const allBets = await Bet.find({});
        for (const bet of allBets) {
            const { totalOdds, totalStake, oddsBoost, status } = bet;

            const decimalOdds = convertAmericanToDecimal(totalOdds); // Convert "totalOdds" to a number
            const expectedBetReturn = calcExpectedBetReturn(totalOdds, totalStake, oddsBoost);
            const betReturn = updateBetReturn(expectedBetReturn, status);

            await Bet.updateOne(
                { _id: bet._id },
                {
                    $set: {
                        "totalOdds": decimalOdds,
                        "expectedBetReturn": expectedBetReturn,
                        "betReturn": betReturn,
                    }
                }
            )
            .then(result => {
                console.log(`${result.modifiedCount} documents updated.`);
            })
            .catch(err => {
                console.error(err);
            });
        }
        console.log('success!')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
