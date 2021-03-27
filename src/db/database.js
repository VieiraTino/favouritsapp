const mongoose = require('mongoose');

const connectionURL = 'mongodb+srv://favouritesApp:w334r4fQg5kdrbN3@cluster0.5el1z.mongodb.net/favouritesapp';

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true
});