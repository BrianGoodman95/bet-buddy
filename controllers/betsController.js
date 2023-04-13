import Bet from '../models/bet.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, UnAthenticatedError } from '../errors/index.js'
import { v4 as uuidv4 } from 'uuid';

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
    res.send('Delete Bet')
}

const getAllBets = async (req, res) => {
    const bets = await Bet.find({ createdBy: req.user.userId })
    res.status(StatusCodes.OK).json({ bets, totalBets: bets.length, numOfPages: 1 })
}

const updateBet = async (req, res) => {
    res.send('Update Bet')
}

const showStats = async (req, res) => {
    res.send('Show Stats')
}

export { createBet, deleteBet, getAllBets, updateBet, showStats }