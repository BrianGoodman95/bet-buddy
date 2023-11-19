import Leg from '../models/Leg.js'
import { expandEventData } from './utils/expandResultData.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import moment from 'moment';
// import Math from 'math';

const createLeg = async (req, res) => {
    const { legDescription, event_id, status } = req.body
    if (!legDescription || !event_id || !status) {
        throw new BadRequestError('Please Provide All Values')
    }
    req.body.createdBy = req.user.userId
    // req.body.customEventId = uuidv4()
    const leg = await Leg.create(req.body)
    res.status(StatusCodes.CREATED).json({ leg })
}

const updateLeg = async (req, res) => {
    const { id: legId } = req.params
    const { legDescription, event_id, status } = req.body
    if (!legDescription || !event_id || !status) {
        throw new BadRequestError('Please Provide All Values')
    }

    const leg = await Leg.findOne({ _id: legId })
    if (!leg) {
        throw new NotFoundError(`No Leg with id ${legId} Found`)
    }

    checkPermissions(req.user, leg.createdBy);

    const updateLeg = await Leg.findOneAndUpdate(
        { _id: legId },
        req.body,
        { new: true, runValidators: true }
    );
    // const updateLeg = await Leg.create(req.body)
    res.status(StatusCodes.OK).json({ updateLeg })
}

const deleteLeg = async (req, res) => {
    const { id: legId } = req.params
    const leg = await Leg.findOne({ _id: legId })
    if (!leg) {
        throw new NotFoundError(`No Leg with id ${legId} Found`)
    }
    checkPermissions(req.user, leg.createdBy);

    await leg.deleteOne({ _id: legId })
    res.status(StatusCodes.OK).json({ msg: "Leg removed!" })
}

const getLeg = async (req, res) => {
    const { id: legId } = req.params
    const leg = await Leg.findOne({ _id: legId }).lean()
    if (!leg) {
        throw new NotFoundError(`No Leg with id ${legId} Found`)
    }
    checkPermissions(req.user, leg.createdBy);

    const updatedLeg = await expandEventData([leg]);

    res.status(StatusCodes.OK).json({ leg: updatedLeg[0] });
}

const getAllLegs = async (req, res) => {
    const { legDescription, sort, odds, stake, status } = req.query
    //Add stuff based on conditions
    const queryObject = {
        createdBy: req.user.userId,
    }
    if (legDescription) {
        queryObject.legDescription = { $regex: legDescription, $options: 'i' }
    }
    if (status) {
        if (status !== 'all') {
            queryObject.status = status
        }
    }

    /* ###### ALL BETS QUERY ###### */
    let legResults = Leg.find(queryObject)
    legResults = legResults.sort('-createdAt')
    const allLegs = await legResults.lean()
    const updatedLegs = await expandEventData(allLegs);

    // Get all events and get the lists of each column to use for filters
    const statuses = [...new Set(updatedLegs.map(leg => leg.status))];
    
    /* ###### Pagination Stuff ###### */
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // 10 per page
    const skip = (page - 1) * limit; // skip N per page for page N > 1
    const totalLegs = updatedLegs.length
    const numOfPages = Math.ceil(totalLegs / limit)

    let pageResults = updatedLegs.slice(skip, skip + limit);    

    if (sort == 'newest') {
        pageResults = pageResults.sort('-createdAt')
    }
    if (sort == 'oldest') {
        pageResults = pageResults.sort('createdAt')
    }
    if (sort == 'a-z') {
        pageResults = pageResults.sort('legDescription')
    }
    if (sort == 'z-a') {
        pageResults = pageResults.sort('-legDescription')
    }
    
    // Append the response with extra information inlcuding the query results (legs), the number of legs and num of pages
    res.status(StatusCodes.OK).json({ 
        legs: pageResults,
        filterOptions: {
            legStatusOptions: statuses
        },
        totalLegs: totalLegs, 
        numOfPages: numOfPages 
    })
}

const showStats = async (req, res) => {
    let stats = await Leg.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$legStatus', count: { $sum: 1 } } }
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: legStatus, count } = curr
        acc[legStatus] = count
        return acc
    }, {})

    const defaultStats = {
        Push: stats.Push || 0,
        Open: stats.Open || 0,
        Live: stats.Live || 0,
        Lost: stats.Lost || 0,
        Won: stats.Won || 0
    }

    let weeklyLegs = await Leg.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    week: { $week: '$createdAt' }
                },
                count: {
                    $sum: 1
                },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1, '_id.week': -1 } },
        { $limit: 6 }
    ])
    weeklyLegs = weeklyLegs.map((item) => {
        const { _id: { year, month, week }, count } = item
        const date = moment()
            .week(week) // -1 because moment does weeks 0-11, but mongo did 1-12
            .month(month - 1)
            .year(year)
            .format('WW MMM Y')
        return { date, count }
    })

    res.status(StatusCodes.OK).json({ defaultStats, weeklyLegs })
}

export { createLeg, deleteLeg, getAllLegs, getLeg, updateLeg, showStats }