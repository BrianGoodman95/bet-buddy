// This checks for the user token before making every request to ensure they are still validly making the requests
import jwt from 'jsonwebtoken'
import { UnAthenticatedError } from "../errors/index.js"

const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer')) {
        throw new UnAthenticatedError('Authentication Invalid')
    }
    const token = authHeader.split(' ')[1]

    try {
        // Check the token is valid for our secret
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // add this object to the request object
        req.user = { userId: payload.userId }
        // console.log(req.user)
        next()
    } catch (error) {
        throw new UnAthenticatedError('Authentication Invalid')
    }
}

export default auth