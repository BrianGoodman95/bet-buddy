import User from '../models/User.js'
import {StatusCodes} from 'http-status-codes'
import { BadRequestError, UnAthenticatedError } from "../errors/index.js"

const register = async (req, res) => { //(req, res, next))
    // Define the request
    const {name,email,password} = req.body
    //Assign known, default errors
    if(!name || !email || !password){
        throw new BadRequestError("Please Provide All Values")
    }
    const userAlreadyExists = await(User.findOne({email}))
    if (userAlreadyExists){
        throw new BadRequestError('Email Already In Use')
    }
    const user = await User.create(req.body) // use everything in the request body
    // const user = await User.create({name, email, password}) // only use the fields required by the user model
    
    // Create a token to define the users session
    const token = user.createJWT()
    
    // Define what to send back in the response
    // Even though password isn't sent back by default via the "select:false" in the model,
    // The response actually overrides that so we actually have to explicitly not include
    // it by doing these accrobatics
    res.status(StatusCodes.CREATED).json({user: {
        name:user.name,
        lastName:user.lastName,
        email:user.email,
        location:user.location,
    }, 
    token,
    location: user.location,})
}


const login = async (req, res) => {
    const {email, password} = req.body

    // check that both fields are provided
    if(!email || !password){
        throw new BadRequestError("Please Provide All Values")
    }
    
    const user = await User.findOne({email}).select('+password')
    // check that the user exists
    if (!user){
        throw new UnAthenticatedError('Invalid Email')
    }
    // check that the user provided the correct password
    const correctPassword = await user.comparePassword(password);
    if (!correctPassword){
        throw new UnAthenticatedError('Invalid Password')
    }
    
    // Create a token to define the users session
    const token = user.createJWT()
    // set password to undefined so it doesn't show in the response!
    user.password = undefined

    res.status(StatusCodes.OK).json({user, token, location: user.location,})
}

const updateUser = (req, res) => {
    res.send('Update User')
}

export {register, login, updateUser}
