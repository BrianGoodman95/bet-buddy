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

// File Dir helpers
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// Security libraries
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(cookieParser());

// setup the logging tool
// if (process.env.NODE_ENV != 'production') {
//     app.use(morgan('dev'))
// }

// makes json data available in the controllers. Built in express middleware
app.use(express.json())

app.set('trust proxy', true);

const __dirname = dirname(fileURLToPath(import.meta.url));
// only when ready to deploy
app.use(express.static(path.resolve(__dirname, './client/build')));

// main route
app.get('/',(req,res) => {
    // throw new Error('error')
    res.send('Hello World')
})

// custom routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/bets', authenticateUser, betsRouter)

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './client/build', 'index.html'))
})
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
