const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const authRoute = require('./router/auth');
const ItemRouteModule = require('./router/item');

dotenv.config();

mongoose.connect(
    process.env.DB_CONNETCT,
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => console.log('tamamke')
);

//middleware

app.use(express.json());


app.use('/api/user', authRoute);

app.use('/item', ItemRouteModule);

app.listen(3000, () => console.log('tamam gel'));