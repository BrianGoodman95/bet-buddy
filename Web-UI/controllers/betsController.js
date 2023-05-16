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

    const { search, sort, betSource, eventCategory, oddsMaker, pick, betStatus } = req.query
    //Add stuff based on conditions
    const queryObject = {
        createdBy: req.user.userId,
    }

    if (search) {
        queryObject.eventDescription = { $regex: search, $options: 'i' }
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
    // No Await
    let result = Bet.find(queryObject)
    // chain sort conditions
    if (sort == 'newest') {
        result = result.sort('-createdAt')
    }
    if (sort == 'oldest') {
        result = result.sort('createdAt')
    }
    if (sort == 'a-z') {
        result = result.sort('eventDescription')
    }
    if (sort == 'z-a') {
        result = result.sort('-eventDescription')
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // 10 per page
    const skip = (page - 1) * limit; // skip N per page for page N > 1

    result = result.skip(skip).limit(limit);

    const bets = await result
    const totalBets = await Bet.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalBets / limit)
    // Append the response with extra information inlcuding the query results (bets), the number of bets and num of pages
    res.status(StatusCodes.OK).json({ bets, totalBets: totalBets, numOfPages: numOfPages })
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