import "http-status-codes"
import {StatusCodes} from 'http-status-codes'

const errorHandlerMiddleware = (err, req, res, next) => {
    console.log(err);
    const defaultError = {
        // if there's already a message & status code assigned, use it. Else Assign a default.
        msg: err.message || 'Internal Server Error',
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR
    }
    if(err.name === 'ValidationError') { // missing value on db actions
        console.log(err)
        defaultError.statusCode = StatusCodes.BAD_REQUEST;
        // defaultError.msg = err.message;
        defaultError.msg = Object.values(err.errors)
            .map(item => item.message)
            .join(', ');
    }
    if(err.code && err.code === 11000){ // code we found is returned in the error if a duplicate email is tried to register 
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} has to be unique`
    }
    // res.status(defaultError.statusCode).json({msg: err});
    res.status(defaultError.statusCode).json({msg: defaultError.msg});
}

export default errorHandlerMiddleware;