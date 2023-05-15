import { readFile } from 'fs/promises'
import dotenv from 'dotenv';
dotenv.config()

import connectDB from './db/connect.js'
import Bet from './models/bet.js'

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        // await Bet.deleteMany()
        const jsonProducts = JSON.parse(await readFile(new URL('./mock-data.json', import.meta.url)))
        await Bet.create(jsonProducts)
        console.log('success!')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()