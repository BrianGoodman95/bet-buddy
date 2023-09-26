import Sport from '../models/Sport.js'
import { StatusCodes } from 'http-status-codes'
import { BadRequestError, NotFoundError } from '../errors/index.js'
import checkPermissions from '../utils/checkPermissions.js'
import { v4 as uuidv4 } from 'uuid';

const createSport = async (req, res) => {
    const { name, league } = req.body
    if (!name || !league ) {
        throw new BadRequestError('Please Provide All Values')
    }
    console.log(req)
    const sport = await Sport.create(req.body)
    res.status(StatusCodes.CREATED).json({ sport })
}

const updateSport = async (req, res) => {
    const { id: sportId } = req.params
    const { name, league } = req.body
    if (!name || !league ) {
        throw new BadRequestError('Please Provide All Values')
    }

    const sport = await Sport.findOne({ _id: sportId })
    if (!sport) {
        throw new NotFoundError(`No Sport with id ${sportId} Found`)
    }

    // checkPermissions(req.user, req.user);

    const updateSport = await Sport.findOneAndUpdate(
        { _id: sportId },
        req.body,
        { new: true, runValidators: true }
    );
    // const updateSport = await Sport.create(req.body)
    res.status(StatusCodes.OK).json({ updateSport })
}

const deleteSport = async (req, res) => {
    const { id: sportId } = req.params
    const sport = await Sport.findOne({ _id: sportId })
    if (!sport) {
        throw new NotFoundError(`No Sport with id ${sportId} Found`)
    }
    // checkPermissions(req.user, req.user);

    await sport.deleteOne({ _id: sportId })
    res.status(StatusCodes.OK).json({ msg: "Sport removed!" })
}

const getSport = async (req, res) => {
    const { id: sportId } = req.params
    const sport = await Sport.findOne({ _id: sportId })
    if (!sport) {
        throw new NotFoundError(`No Sport with id ${sportId} Found`)
    }
    res.status(StatusCodes.OK).json({ sport: sport })
}

const getAllSports = async (req, res) => {

    const { sort, name, league } = req.query
    //Add stuff based on conditions
    const queryObject = {}

    if (league) {
        if (league !== 'all') {
            queryObject.league = league
        }
    }
    if (name) {
        if (name !== 'all') {
            queryObject.name = name
        }
    }

    /* ###### SINGLE PAGE BETS QUERY ###### */
    // Define the query and chain sort conditions for the page sports
    let pageResults = Sport.find(queryObject)
    if (sort == 'newest') {
        pageResults = pageResults.sort('-createdAt')
    }
    if (sort == 'oldest') {
        pageResults = pageResults.sort('createdAt')
    }
    if (sort == 'a-z') {
        pageResults = pageResults.sort('league')
    }
    if (sort == 'z-a') {
        pageResults = pageResults.sort('-league')
    }
    // Do the math to figure out how many sports to show based on page #
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10; // 10 per page
    const skip = (page - 1) * limit; // skip N per page for page N > 1
    pageResults = pageResults.skip(skip).limit(limit);
    // Get the sports for that page, the count and the number of pages
    const pageSports = await pageResults
    const totalSports = await Sport.countDocuments(queryObject)
    const numOfPages = Math.ceil(totalSports / limit)


    /* ###### ALL BETS QUERY ###### */
    // define query and sort condition for all sports
    let allResults = Sport.find(queryObject)
    allResults = allResults.sort('createdAt')

    // Get all sports and get the lists of each column to use for filters
    const allSports = await allResults
    const leagues = [...new Set(allSports.map(sport => sport.league))];
    const names = [...new Set(allSports.map(sport => sport.name))];
    
    // Append the response with extra information inlcuding the query results (sports), the number of sports and num of pages
    res.status(StatusCodes.OK).json({ 
        sports: pageSports,
        filterOptions: {
            leagueOptions: leagues, 
            nameOptions: names
        },
        totalSports: totalSports, 
        numOfPages: numOfPages 
    })
}

export { createSport, deleteSport, getAllSports, updateSport, getSport }