// core modules
import express from 'express';
import dotenv from 'dotenv';
import corse from 'cors';

//local modules
import userRouter from './routes/UserRouter.js';
import DBConnection from './config/DBConnections.js';

dotenv.config();
const app = express();

app.use((req, res, next) => {
    console.log('Hello World');
    next();
});

app.use(express.urlencoded())
app.use(express.json());
app.use(corse());
DBConnection(process.env.DB_URL);


app.use('/user', userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.FRONT_END_URL}`);
});