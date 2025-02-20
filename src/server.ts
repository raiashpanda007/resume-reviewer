import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true, // Allow credentials (cookies, tokens, etc.)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token'],
}))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.send('Hello World!');
})
import authRouter from './routes/auth.route';
app.use('/auth', authRouter);
import resumeRouter from './routes/resume.route';
app.use('/resume', resumeRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})