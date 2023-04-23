const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const morgan = require('morgan');
const rfs = require('rotating-file-stream');
var path = require('path');
const bodyParser = require('body-parser');
const router = require('./routes/routes');
const port = 6080;

// whitelist the domain name so we only allow requests when initiated from it by the app
var whitelist = ['https://www.xxxxxxxx.com', 'https://www.xxxxxxxxxx.com']

const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    },
    // origin: '*',
    methods: 'POST',
    preflightContinue: true,
    optionsSuccessStatus: 200
}

app.options('/submit', cors(corsOptions));
app.post("/submit", cors(corsOptions), (req, res, next) => {
    console.info("CORS POST request issued from: " + JSON.stringify(req.headers.origin));
    next();
});

// create a rotating write stream
var accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});
var allLogStream = rfs('all.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});
// create a rotating write stream
var errorLogStream = rfs('error.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
});
var loggerFormat = ':origin [:date[web]] ":method :url" :status :response-time :reqobj';

// configure logger for debugging log header/body
morgan.token('origin', function getId(req) {
    return req.headers.origin;
});
morgan.token('reqobj', function getId(req) {
    return JSON.stringify(req.body);
});
// set up logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: allLogStream
}));
app.use(morgan(loggerFormat, {
    skip: function (req, res) {
        return res.statusCode >= 400
    },
    stream: errorLogStream
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', router);
app.listen(port, () => {
    console.log("Express Server started on port " + port);
})