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
import Leg from '../models/Leg.js'
import { convertAmericanToDecimal, } from '../controllers/utils/calcBetAttributes.js'

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        const allLegs = await Leg.find({});
        for (const leg of allLegs) {
            const { odds } = leg;

            const decimalOdds = convertAmericanToDecimal(odds); // Convert "totalOdds" to a number

            await Leg.updateOne(
                { _id: leg._id },
                {
                    $set: {
                        "odds": decimalOdds,
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

