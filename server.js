
const express = require("express");

const dotenv = require('dotenv');
const cors = require("cors");
const HttpException = require('./utils/HttpException.utils');
const errorMiddleware = require('./middleware/error.middleware');
//####################IMPORT ROUTES#####################################################
const userRouter = require('./routes/user.route');
const studentsRouter = require('./routes/students.route');
//##################//IMPORT ROUTES#####################################################



// Init express
const app = express();
// Init environment
dotenv.config();
// parse requests of content-type: application/json
// parses incoming requests with JSON payloads
app.use(express.json());
// parses application /x-www-fofrm-urlencoded
app.use(express.urlencoded({extended:true}));

// enabling cors for all requests by using cors middleware
app.use(cors());
// Enable pre-flight
app.options("*", cors());

const port = Number(process.env.PORT || 3331);
//####################ROUTES ENDPOINT#####################################################
app.use('/api/v1/users', userRouter);
app.use('/api/v1/students', studentsRouter);
//##################//ROUTES ENDPOINT#####################################################


// 404 error
app.all('*', (req, res, next) => {
    const err = new HttpException(404, 'Endpoint Not Found');
    next(err);
});

// Error middleware
app.use(errorMiddleware);

// starting the server
app.listen(port, () =>
    console.log(`🚀 Server running on port ${port}!`));


module.exports = app;