require('dotenv').config();
import http from 'http';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import * as MySQLConnector from './utils/mysql.connector';
import authRoutes from './routes/authRoutes';
import feedRoutes from './routes/feedRoutes';
import { BaseResponse } from './models/BaseResponse';
// import fileUpload from 'express-fileupload';
const fileUpload = require("express-fileupload");


const app: Express = express();

// create database pool
MySQLConnector.init();
/** Compression */
const compression = require('compression')
app.use(compression());
/** Logging */
app.use(morgan('dev'));
/** Parse the request */
app.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
app.use(express.json());
/** Enable file upload */
app.use(fileUpload());

/** RULES OF OUR API */
app.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/** Routes */
app.use("/auth", authRoutes);
app.use("/feed", feedRoutes);

/** Error handling */
app.use((req, res, next) => {
    const error = new Error('Not Found');
    return res.status(404).json(new BaseResponse(error));
});

/** Server */
const httpServer = http.createServer(app);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
