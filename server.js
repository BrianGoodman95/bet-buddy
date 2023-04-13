import express from 'express';
const app = express()
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import morgan from 'morgan'

// db authenticate user
import connectDB from './db/connect.js';

// routers
import authRouter from './routes/authRoutes.js';
import betsRouter from './routes/betsRoutes.js';

// middleware
import notFoundMiddleware from './middleware/not-found.js';
import errorHandleMiddleware from './middleware/error-handler.js';
import authenticateUser from './middleware/auth.js';

// makes json data available in the controllers. Built in express middleware
app.use(express.json())

// setup the logging tool
if (process.env.NODE_ENV != 'production') {
    app.use(morgan('dev'))
}

// main route
app.get('/',(req,res) => {
    // throw new Error('error')
    res.send('Hello World')
})

// custom routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/bets', authenticateUser, betsRouter)

// middleware to handle all undefined routes
app.use(notFoundMiddleware)
// express-async-errors looks for the last app.use middleware and by default will pass in
// any "thrown Errors" to this middleware
app.use(errorHandleMiddleware)

const port = process.env.PORT || 5001;

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL)
        app.listen(port, () => {
            console.log(`Server started on port ${port}`);
        })
    } catch (error) {
        console.log(error)
    }
}

start()
