import { StatusCodes } from "http-status-codes"
import CustomAPIError from "./custom-api.js"

// Extend our custom Error class and customize it further as needed
class BadRequestError extends CustomAPIError {
    constructor(message){
        super(message)
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

export { BadRequestError }
