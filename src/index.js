const express = require('express');
const hbs = require('hbs');
const path = require('path');

//routers
const userRouter = require('./routers/api/api-user');
const moviesRouter = require('./routers/api/api-movies');
const favouritesRouter = require('./routers/api/api-favourites');
const frontUserRouter = require('./routers/ui/user');

//database
require('./db/database');

const app = express();
const port = process.env.PORT || 3000;

const publicPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials');
app.use(express.static(publicPath));

app.set('view engine', 'hbs');
app.set('views', viewsPath);

hbs.registerPartials(partialsPath);

app.use(express.json());

app.use(userRouter);
app.use(moviesRouter);
app.use(favouritesRouter);

app.use(frontUserRouter);





// --- Iniciar servidor
// C:\Users\Tino\mongodb\bin\mongod.exe --dbpath=C:\Users\Tino\mongodb-data
app.listen(port, () => {
    console.log('Server Online');
});