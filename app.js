const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const ordersRoutes = require('./api/routes/orders');

// problem conexao
mongoose.connect(
    "mongodb+srv://node-shop:nodeshop@cluster0-vfvxp.mongodb.net/test?retryWrites=true&w=majority",
    { 
        //useMongoClient: true,
        useNewUrlParser: true,
        useUnifiedTopology: true 
    }, function(error){console.log(error)}
);

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!');
})

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if(req.method === 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    next();
});

// Routes which should handle requests
app.use('/products', productRoutes);
app.use('/orders', ordersRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message : error.message
        }
    });
});

module.exports = app;