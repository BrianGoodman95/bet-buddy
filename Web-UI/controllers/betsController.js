import Bet from '../models/bet.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import moment from 'moment';
// import Math from 'math';

const createBet = async (req, res) => {
    const { eventCategory, eventDescription, oddsMaker, spread, pick, wager } = req.body
    if (!eventCategory || !eventDescription || !oddsMaker || !spread || !pick || !wager) {
        throw new BadRequestError('Please Provide All Values')
    }
    req.body.createdBy = req.user.userId
    req.body.customEventId = uuidv4()
    console.log(req)
    const bet = await Bet.create(req.body)
    res.status(StatusCodes.CREATED).json({ bet })
}

const deleteBet = async (req, res) => {
    const { id: betId } = req.params
    const bet = await Bet.findOne({ _id: betId })
    if (!bet) {
        throw new NotFoundError(`No Bet with id ${betId} Found`)
    }
    checkPermissions(req.user, bet.createdBy);

    await bet.deleteOne({ _id: betId })
    res.status(StatusCodes.OK).json({ msg: "Bet removed!" })
}

const getAllBets = async (req, res) => {

    const { eventDescription, sort, betSource, eventCategory, oddsMaker, pick, betStatus } = req.query
    //Add stuff based on conditions
    const queryObject = {
        createdBy: req.user.userId,
    }

    if (eventDescription) {
        queryObject.eventDescription = { $regex: eventDescription, $options: 'i' }
    }
    if (betSource) {
        if (betSource !== 'all') {
            queryObject.betSource = betSource
        }
    }
    if (eventCategory) {
        if (eventCategory !== 'all') {
            queryObject.eventCategory = eventCategory
        }
    }
    if (oddsMaker) {
        if (oddsMaker !== 'all') {
            queryObject.oddsMaker = oddsMaker
        }
    }
    if (pick) {
        if (pick !== 'all') {
            queryObject.pick = pick
        }
    }
    if (betStatus) {
        if (betStatus !== 'all') {
            queryObject.betStatus = betStatus
        }
    }

    /* ###### SINGLE PAGE BETS QUERY ###### */
    // Define the query and chain sort conditions for the page bets
    let pageResults = Bet.find(queryObject)
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
    // Do the math to figure out how many bets to show based on page #
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // 10 per page
    const skip = (page - 1) * limit; // skip N per page for page N > 1
    pageResults = pageResults.skip(skip).limit(limit);
    // Get the bets for that page, the count and the number of pages
    const pageBets = await pageResults
    const totalBets = await Bet.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalBets / limit)


    /* ###### ALL BETS QUERY ###### */
    // define query and sort condition for all bets
    let allResults = Bet.find(queryObject)
    allResults = allResults.sort('createdAt')

    // Get all bets and get the lists of each column to use for filters
    const allBets = await allResults
    const betSources = [...new Set(allBets.map(bet => bet.betSource))];
    const eventCategories = [...new Set(allBets.map(bet => bet.eventCategory))];
    const oddsMakers = [...new Set(allBets.map(bet => bet.oddsMaker))];
    const spreads = [...new Set(allBets.map(bet => bet.spread))];
    const picks = [...new Set(allBets.map(bet => bet.pick))];
    const betStatuses = [...new Set(allBets.map(bet => bet.betStatus))];
    
    
    // Append the response with extra information inlcuding the query results (bets), the number of bets and num of pages
    res.status(StatusCodes.OK).json({ 
        bets: pageBets,
        filterOptions: {
            betSourceOptions: betSources,
            eventCategoryOptions: eventCategories, 
            oddsMakerOptions: oddsMakers,
            spreadOptions: spreads,
            pickOptions: picks,
            betStatusOptions: betStatuses
        },
        totalBets: totalBets, 
        numOfPages: numOfPages 
    })
}

const updateBet = async (req, res) => {
    const { id: betId } = req.params
    const { eventCategory, eventDescription, oddsMaker, spread, pick, wager } = req.body
    if (!eventCategory || !eventDescription || !oddsMaker || !spread || !pick || !wager) {
        throw new BadRequestError('Please Provide All Values')
    }

    const bet = await Bet.findOne({ _id: betId })
    if (!bet) {
        throw new NotFoundError(`No Bet with id ${betId} Found`)
    }

    checkPermissions(req.user, bet.createdBy);

    const updateBet = await Bet.findOneAndUpdate(
        { _id: betId },
        req.body,
        { new: true, runValidators: true }
    );
    // const updateBet = await Bet.create(req.body)
    res.status(StatusCodes.OK).json({ updateBet })
}

const showStats = async (req, res) => {
    let stats = await Bet.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        { $group: { _id: '$betStatus', count: { $sum: 1 } } }
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: betStatus, count } = curr
        acc[betStatus] = count
        return acc
    }, {})

    const defaultStats = {
        Push: stats.Push || 0,
        Unsettled: stats.Unsettled || 0,
        Live: stats.Live || 0,
        Lost: stats.Lost || 0,
        Won: stats.Won || 0
    }

    let monthlyBets = await Bet.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
        {
            $group: {
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: {
                    $sum: 1
                },
            },
        },
        { $sort: { '_id.year': -1, '_id.month': -1 } },
        { $limit: 6 }
    ])
    monthlyBets = monthlyBets.map((item) => {
        const { _id: { year, month }, count } = item
        const date = moment()
            .month(month - 1) // -1 because moment does months 0-11, but mongo did 1-12
            .year(year)
            .format('MMM Y')
        return { date, count }
    })

    res.status(StatusCodes.OK).json({ defaultStats, monthlyBets })
}

export { createBet, deleteBet, getAllBets, updateBet, showStats }