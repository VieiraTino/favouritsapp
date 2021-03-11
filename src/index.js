const express = require('express');

const moviesRouter = require('./routers/movies')
const favouritesRouter = require('./routers/favourites')
const favouritesRouter = require('./routers/user')
// require('./db/database');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use(userRouter);
app.use(moviesRouter);
app.use(favouritesRouter);

// usar hbs
// const path = require('path');
// const hbs = require('hbs');

// const viewsPath = path.join(__dirname, '../templates/views');

// app.set('view engine', 'hbs');
// app.set('views', viewsPath);



// --- Iniciar servidor
// C:\Users\Tino\mongodb\bin\mongod.exe --dbpath=C:\Users\Tino\mongodb-data
app.listen(port, () => {
    console.log('Server Online');
});