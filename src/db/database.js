const mongoose = require('mongoose');

const connectionURL = process.env.mongodb_connection;

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true
});