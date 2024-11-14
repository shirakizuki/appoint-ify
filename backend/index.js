// IMPORT LIBRARY
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// IMPORT OBJECT
import router from './route/routes.js';

// INITIALIZE BACKEND SERVER
const app = express();
const port = 4000;

// CONFIGURE ENVIRONMENT VARIABLE
dotenv.config();

// MIDDLEWARE
app.use(cors({
    origin:"https://appoint-ify-shirazuki.vercel.app/",
    methods:['POST', 'PUT', 'PATCH', 'GET', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 600
}));
app.use(express.json());

// TEST API AT DEFAULT ROUTE
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// CREATE API END POINT
app.use('/api', router);