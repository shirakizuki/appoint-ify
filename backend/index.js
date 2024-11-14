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
    origin: '*',
    methods: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
    allowedHeaders: 'Origin, X-Api-Key, X-Requested-With, Content-Type, Accept, Authorization'
}));

app.options('*', cors()); 
app.use(express.json());

// TEST API AT DEFAULT ROUTE
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// CREATE API END POINT
app.use('/api', router);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));