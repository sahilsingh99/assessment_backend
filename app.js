var express         = require('express'),
    morgan          = require('morgan'),
    cors            = require('cors'),
    mongoose        = require('mongoose'),
    cookieParser    = require('cookie-parser'),
    env             = require('dotenv');

// setting app configurations and several packages.
var app = express();
env.config();
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());

const URI = process.env.DBURI;
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(res => {
        console.log("connected to database");
    })
    .catch(err => {
        console.log(err);
    });

// import routes
const authRoute = require('./routes/auth');
const eventRoute = require('./routes/event');

// Signal EndPoint    
app.get('/', (req, res, next) => {
    res.status(200).json({
        message: 'Working fine'
    })
});

app.use('/api/auth', authRoute);
app.use('/api/event',eventRoute);


// error for invalid route
app.use((req, res, next) => {
    const error = new Error("Not Found");
    error.status = 404;
    next(error);
});

// error handler
app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            custom_message : error.custom_message,
            message: error.message
        }
    })
})

const port = process.env.PORT || 3000;
app.listen(port, (req, res) => {
    console.log("Server is Live!");
})