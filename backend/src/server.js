import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// rate limiting for security
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use('/api/',limiter);

// health check endpoint
app.get('/api/', (req, res) => {
    res.json({ status: "OK", message: "API is running" });
});

// api endpoint
app.get('/', (req, res) => {
    res.send("Welcome to Sweet API")
})

// listening to the server on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

export default app;

