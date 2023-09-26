import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
// Get the current module's URL
const currentModuleURL = import.meta.url;
// Convert the URL to a file path
const __filename = fileURLToPath(currentModuleURL);
const __dirname = path.dirname(__filename);
// Determine the path to the .env file relative to this script
const envPath = path.resolve(__dirname, '../.env'); // Adjust the path as needed
// Load environment variables from the specified path
dotenv.config({ path: envPath });

import connectDB from '../db/connect.js'
import Bet from '../models/bet.js'

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        // await Bet.updateMany(
        // { /* Filter criteria */ },
        // { 
        //     $rename: { 
        //         "oddsMaker": "sportsBook"
        //     }
        // }
        // )
        await Bet.updateMany(
            { /* Filter criteria */ },
            { 
                $set: { // Add a new field called "return" with a value of 0
                    "oddsBoost": 0,
                    "creditStake": 0,
                    "expectedReturn": 0,
                    "bonusReturn": 0,
                    "totalReturn": 0,
                } 
            }
            )
        .then(result => {
            console.log(`${result.modifiedCount} documents updated.`);
        })
        .catch(err => {
            console.error(err);
        });
        console.log('success!')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
