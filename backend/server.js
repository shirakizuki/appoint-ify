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
app.use(cors());
app.use(express.json());

// TEST API AT DEFAULT ROUTE
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// CREATE API END POINT
app.use('/api', router);

// LIST TO PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})