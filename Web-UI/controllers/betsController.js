import Bet from '../models/Bet.js'
import Leg from '../models/Leg.js'
import { expandLegData } from './utils/expandResultData.js'
import prepareBetData from '../utils/calcBetAttributes.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';
import moment from 'moment';
// import Math from 'math';

const createBet = async (req, res) => {
    const { leg_ids, sportsBook, totalStake, status } = req.body
    if (!leg_ids || !sportsBook || !totalStake || !status) {
        throw new BadRequestError('Please Provide All Values')
    }
    req.body.createdBy = req.user.userId
    // We should probably move this business logic to the front end or middlewear
    const updatedBet = await prepareBetData(req.body);

    const bet = await Bet.create(updatedBet)
    res.status(StatusCodes.CREATED).json({ bet })
}

const updateBet = async (req, res) => {
    const { id: betId } = req.params
    const { leg_ids, sportsBook, totalStake, status } = req.body
    if (!leg_ids || !sportsBook || !totalStake || !status) {
        throw new BadRequestError('Please Provide All Values')
    }

    const bet = await Bet.findOne({ _id: betId })
    if (!bet) {
        throw new NotFoundError(`No Bet with id ${betId} Found`)
    }

    checkPermissions(req.user, bet.createdBy);

    const updatedBet = await prepareBetData(req.body);

    const updateBet = await Bet.findOneAndUpdate(
        { _id: betId },
        updatedBet,
        { new: true, runValidators: true }
    );

    res.status(StatusCodes.OK).json({ updateBet })
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

const getBet = async (req, res) => {
    const { id: betId } = req.params
    const bet = await Bet.findOne({ _id: betId }).lean();
    if (!bet) {
        throw new NotFoundError(`No Bet with id ${betId} Found`)
    }
    checkPermissions(req.user, bet.createdBy);

    const updatedBet = await expandLegData([bet]);

    res.status(StatusCodes.OK).json({ bet: updatedBet[0] })
}

const getAllBets = async (req, res) => {

    const { leg_ids, sort, sportsBook, totalOdds, creditStake, totalStake, oddsBoost, expectedBetReturn, bonusReturn, betReturn, status } = req.body
    //Add stuff based on conditions
    const queryObject = {
        createdBy: req.user.userId,
    }
    if (sportsBook) {
        if (sportsBook !== 'all') {
            queryObject.sportsBook = sportsBook
        }
    }
    if (status) {
        if (status !== 'all') {
            queryObject.status = status
        }
    }

    /* ###### ALL BETS QUERY ###### */
    // define query and sort condition for all bets
    let betResults = Bet.find(queryObject)
    betResults = betResults.sort('-createdAt')
    const allBets = await betResults.lean()
    const updatedBets = await expandLegData(allBets); //allBets for much faster performance

    const sportsBooks = [...new Set(updatedBets.map(bet => bet.sportsBook))];
    const statuses = [...new Set(updatedBets.map(bet => bet.status))];
    
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // 10 per page
    const skip = (page - 1) * limit; // skip N per page for page N > 1
    const totalBets = updatedBets.length
    const numOfPages = Math.ceil(totalBets / limit)

    let pageResults = updatedBets.slice(skip, skip + limit);   

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
    
    // Append the response with extra information inlcuding the query results (bets), the number of bets and num of pages
        res.status(StatusCodes.OK).json({ 
        bets: pageResults,
        filterOptions: {
            sportsBookOptions: sportsBooks,
            statusOptions: statuses
        },
        totalBets: totalBets, 
        numOfPages: numOfPages 
    })
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

    let weeklyBets = await Leg.aggregate([
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
    weeklyBets = weeklyBets.map((item) => {
        const { _id: { year, month, week }, count } = item
        const date = moment()
            .week(week) // -1 because moment does weeks 0-11, but mongo did 1-12
            .month(month - 1)
            .year(year)
            .format('WW MMM Y')
        return { date, count }
    })

    res.status(StatusCodes.OK).json({ defaultStats, weeklyBets })
}

export { createBet, deleteBet, getAllBets, getBet, updateBet, showStats }