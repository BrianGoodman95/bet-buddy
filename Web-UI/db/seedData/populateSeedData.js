// We only want to run this once at the beginning of creating the app to setup the initial state

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
import User from '../../models/User.js';
import Sport from '../../models/Sport.js';
import Event from '../../models/Event.js';
import Leg from '../../models/Leg.js';
import Bet from '../../models/Bet.js';

// Add the import assertion for JSON
import users from './users.json' assert { type: 'json' };
import sports from './sports.json' assert { type: 'json' };
import events from './events.json' assert { type: 'json' };
import legs from './legs.json' assert { type: 'json' };
import bets from './bets.json' assert { type: 'json' };
import prepareBetData from '../../utils/calcBetAttributes.js'


const getSeedUsers = async () => {
    const UserEmails = users.map(user => user.email);
    const usersEmailQueryObject = {
        email: { $in: UserEmails },
    };
    const seedUsers = await User.find(usersEmailQueryObject);
    // Extract and return the _ids of the matched users
    const userIds = seedUsers.map(user => user._id);
    return userIds
}

const popSeedUsers = async () => {
    // Loop through each user in the 'users' array
    for (const user of users) {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
            // If the user doesn't exist, create it
            const newUser = new User(user); // Create a new User instance
            // Set the password and hash it
            newUser.password = user.password;
            await newUser.save(); // Call save() to trigger pre('save') middleware
            console.log(`User Created: ${user.name}`);
        } else {
            // If the user already exists, skip it
            await existingUser.save();
            console.log(`User Refreshed: ${user.name}`);
            // const { password, ...userUpdatedInfo } = user;
            // await User.updateOne({_id: existingUser._id}, { $set: userUpdatedInfo });
        }
    }
    console.log('All Users Populated!');
};

const popSeedSports = async () => {
    // Loop through each user in the 'users' array
    for (const sport of sports) {
        // Check if a sport with the same league already exists
        const existingSport = await Sport.findOne({ league: sport.league });
        if (!existingSport) {
            // If the sport doesn't exist, create it
            await Sport.create(sport);
            console.log(`Sport Created: ${sport.league}`);
        } else {
            // If the sport already exists, skip it
            console.log(`Sport Refreshed: ${sport.league}`);
            await Sport.updateOne({ _id: existingSport._id}, { $set: sport });
        }
    }
    console.log('All Sports Populated!');
};

const popSeedEvents = async () => {
    const userIds = await getSeedUsers();
    await Event.deleteMany();
    console.log(`Deleting existing events for users with Ids of: ${userIds}`)
    for ( const userId of userIds ) {
        console.log(`Populating Events for user ${userId}`);
        // Loop through each user in the 'users' array
        for (const event of events) {
            const { sport_league, externalEventId, ...eventsQueryObject } = event;
            // Check if a sport with the needed league exists
            const existingSport = await Sport.findOne({ league: event.sport_league });
            if (existingSport) {
                // Create the Event!
                eventsQueryObject.externalEventId = externalEventId + '-' + userId;
                eventsQueryObject.sport_id = existingSport._id;
                eventsQueryObject.createdBy = userId;
                await Event.create(eventsQueryObject);
                console.log(`Event Created: ${event.name}`);
            } else {
                console.log(`Can't Create Event: ${event.name}. Its Sport Doesn't Exist: ${event.sport_league}`);
            }
        }
        console.log(`All Events Populated for user ${userId}!`);
    }
};

const popSeedLegs = async () => {
    // Remove the existing legs:
    const userIds = await getSeedUsers();
    await Leg.deleteMany({ createdBy: { $in: userIds } });
    console.log(`Deleting existing legs for users with Ids of: ${userIds}`)
    // Add the legs for each userId
    for ( const userId of userIds ) {
        console.log(`Populating Legs for user ${userId}`);
        // Populate the legs again:
        for (const leg of legs) {
            const { external_event_id, ...legsQueryObject } = leg;
            // Check if an event with the needed externalId AND a user with the needed email exists
            const existingEvent = await Event.findOne({ externalEventId: leg.external_event_id + '-' + userId });
            if (existingEvent) {
                // Create the Leg!
                legsQueryObject.event_id = existingEvent._id;
                legsQueryObject.createdBy = userId;
                await Leg.create(legsQueryObject);
                console.log(`Leg Created: ${leg.legDescription}`);
            } else {
                console.log(`Can't Create Leg: ${leg.legDescription}. Its Event Doesn't Exist: ${leg.external_event_id}`);
            }
        }
        console.log(`All Legs Populated for user ${userId}!`);
    }
};

const popSeedBets = async () => {
    const userIds = await getSeedUsers();
    await Bet.deleteMany({ createdBy: { $in: userIds } });
    console.log(`Deleting existing bets for users with Ids of: ${userIds}`)
    for ( const userId of userIds ) {
        console.log(`Populating Bets for user ${userId}`);
        // Get all events created by the user
        const events = await Event.find({ createdBy: userId });

        let count = 0;
        let event = events[0];
        for (const bet of bets) {
            // Assign the event of the bet
            if (count >= events.length) { // If we've been through each event once, now well duplicate events randomly
                // Get a random event to make a bet for
                const randomEventIndex = Math.floor(Math.random() * events.length);
                event = events[randomEventIndex];
            }
            else {
                event = events[count]
            }

            // Find legs with the specified event_id
            let legs = await Leg.find({ event_id: event._id });
            if (count >= events.length) { // If we're doing a random duplicate event, randomly slice some of the legs off the bet
                const randomLegIndex = Math.floor(Math.random() * legs.length);
                legs = legs.slice(1, randomLegIndex+1);
            }
            const leg_ids = legs.map(leg => leg._id);

            // Create the Bet!
            if (leg_ids.length > 0) {
                bet.leg_ids = leg_ids;
                bet.createdBy = userId;
                const updatedBet = await prepareBetData(bet);
                await Bet.create(updatedBet);
                console.log(`Bet Created: ${leg_ids}`);
            }
            count+=1;
        }
        console.log(`All Bets Populated for user ${userId}!`);
    }
};


const popSeedData = async () => {
    try {
        // Connect to your database
        await connectDB(process.env.MONGO_URL)
        
        // Update the various tables
        await popSeedUsers();
        await popSeedSports();
        await popSeedEvents();
        await popSeedLegs();
        await popSeedBets();

    } catch (error) {
        console.error('Error creating test data:', error);
    } finally {
        // Close the database connection
        process.exit(0);
    }
};

popSeedData();
