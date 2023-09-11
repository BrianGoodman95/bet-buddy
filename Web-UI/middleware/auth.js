// This checks for the user token before making every request to ensure they are still validly making the requests
import jwt from 'jsonwebtoken'
import { UnAthenticatedError } from "../errors/index.js"

const auth = async (req, res, next) => {
    // const authHeader = req.headers.authorization
    // if (!authHeader || !authHeader.startsWith('Bearer')) {
    //     throw new UnAthenticatedError('Authentication Invalid')
    // }
    // const token = authHeader.split(' ')[1]

    const cookie = req.headers.cookie
    if (!cookie){ // || !cookie.startsWith('token')) {
        throw new UnAthenticatedError('Authentication Invalid')
    }
    const token = cookie.split('=')[1]

    try {
        // Check the token is valid for our secret
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // Check if its true/false that the userId is that of the test user
        const testUser = payload.userId === "64604a40749e6dad3c4962d1";
        // add this object to the request object
        req.user = { userId: payload.userId, testUser }
        next()
    } catch (error) {
        throw new UnAthenticatedError('Authentication Invalid')
    }
}

export default auth