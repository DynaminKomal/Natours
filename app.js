const express = require('express');
const router = require('./router');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize')
const hpp = require('hpp')


const app = express();
const morgan = require('morgan');
const { sendResponse } = require('./utility/response-utility');

//DEVELOPMENT API LOGGER
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('tiny'));
}

// Limit requests from same api
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 6 * 1000,
    message: 'Too many requests from this IP. Please try again in an hour'
})

app.use('/api', limiter)

//Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize())

//Prevent Parameter Pollution 
app.use(hpp({
    whitelist:[
        'duration'
    ]
}))

// get all tours data

app.use('/api/v1', router);
app.all("*", (req, res, next) => {
    sendResponse(res, 404, "fail", `Can't find ${req.originalUrl} on this server!`)
})


module.exports = app;