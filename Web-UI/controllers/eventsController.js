import Event from '../models/Event.js'
import { expandSportData } from './utils/expandResultData.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import { v4 as uuidv4 } from 'uuid';

const createEvent = async (req, res) => {
    const { name, sport_id, status } = req.body
    if (!name || !sport_id || !status) {
        throw new BadRequestError('Please Provide All Values')
    }
    req.body.createdBy = req.user.userId
    req.body.externalEventId = uuidv4() // ## TODO MAKE THIS ASSIGNED BY MATCHING TO THE EVENTS FROM ODDS API
    console.log(req)
    const event = await Event.create(req.body)
    res.status(StatusCodes.CREATED).json({ event })
}

const updateEvent = async (req, res) => {
    const { id: eventId } = req.params
    const { name, sport_id, status } = req.body
    if (!name || !sport_id || !status) {
        throw new BadRequestError('Please Provide All Values')
    }

    const event = await Event.findOne({ _id: eventId })
    if (!event) {
        throw new NotFoundError(`No Event with id ${eventId} Found`)
    }

    // checkPermissions(req.user, req.user);
    checkPermissions(req.user, event.createdBy);
    const updateEvent = await Event.findOneAndUpdate(
        { _id: eventId },
        req.body,
        { new: true, runValidators: true }
    );
    // const updateEvent = await Event.create(req.body)
    res.status(StatusCodes.OK).json({ updateEvent })
}

const deleteEvent = async (req, res) => {
    const { id: eventId } = req.params
    const event = await Event.findOne({ _id: eventId })
    if (!event) {
        throw new NotFoundError(`No Event with id ${eventId} Found`)
    }
    // checkPermissions(req.user, req.user);
    checkPermissions(req.user, event.createdBy);
    await event.deleteOne({ _id: eventId })
    res.status(StatusCodes.OK).json({ msg: "Event removed!" })
}

const getEvent = async (req, res) => {
    const { id: eventId } = req.params
    const event = await Event.findOne({ _id: eventId }).lean()
    if (!event) {
        throw new NotFoundError(`No Event with id ${eventId} Found`)
    }
    checkPermissions(req.user, event.createdBy);

    const updatedEvent = await expandSportData([ event ]);
    res.status(StatusCodes.OK).json({ event: updatedEvent[0] })
}


const getAllEvents = async (req, res) => {

    const { sort, name, sport_id, status } = req.query
    //Filter based on the query parameters
    const queryObject = {
        createdBy: req.user.userId,
    }
    if (name) {
        queryObject.name = { $regex: name, $options: 'i' }
    }
    if (sport_id) {
        if (sport_id !== 'all') {
            queryObject.sport_id = sport_id
        }
    }
    if (status) {
        if (status !== 'all') {
            queryObject.status = status
        }
    }

    /* ###### ALL BETS QUERY ###### */
    let eventResults = Event.find(queryObject)
    eventResults = eventResults.sort('-createdAt')
    const allEvents = await eventResults.lean()
    const updatedEvents = await expandSportData(allEvents);

    // Get all events and get the lists of each column to use for filters
    const sports = [...new Set(updatedEvents.map(event => event.sport.league))];
    const statuses = [...new Set(updatedEvents.map(event => event.status))];
    
    /* ###### SINGLE PAGE BETS QUERY ###### */
    // Use the same allEvents for pagination, no need to re-query
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // 10 per page
    const skip = (page - 1) * limit; // skip N per page for page N > 1
    const totalEvents = updatedEvents.length
    const numOfPages = Math.ceil(totalEvents / limit)
    
    let pageResults = updatedEvents.slice(skip, skip + limit);    

    if (sort == 'newest') {
        pageResults = pageResults.sort('-createdAt')
    }
    if (sort == 'oldest') {
        pageResults = pageResults.sort('createdAt')
    }
    if (sort == 'a-z') {
        pageResults = pageResults.sort('eventDescription')
    }
    if (sort == 'z-a') {
        pageResults = pageResults.sort('-eventDescription')
    }
    
    // Append the response with extra information inlcuding the query results (events), the number of events and num of pages
    res.status(StatusCodes.OK).json({ 
        events: pageResults,
        filterOptions: {
            sportLeagueOptions: sports, 
            statusOptions: statuses,
        },
        totalEvents: totalEvents, 
        numOfPages: numOfPages 
    })
}

export { createEvent, deleteEvent, getAllEvents, updateEvent, getEvent }