import { StatusCodes } from "http-status-codes"
import CustomAPIError from "./custom-api.js"

// Extend our custom Error class and customize it further as needed
class UnAthenticatedError extends CustomAPIError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.UNAUTHORIZED
    }
}

export { UnAthenticatedError }