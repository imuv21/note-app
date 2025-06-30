import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import connectDB from './config/connectDB.js';
import rateLimiter from './middlewares/rateLimiter.js';
import authRoutes from './routes/authRoutes.js';
import noteRoutes from './routes/noteRoutes.js';

export const app = express();

export const initializeDB = async () => {
    const DATABASE_URL = process.env.DATABASE_URL;
    if (!DATABASE_URL) {
        throw new Error('❌ DATABASE_URL is not found!');
    }
    await connectDB(DATABASE_URL);
};

export const allowedOrigins = (process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : [
    "http://localhost:5173",
    "https://note21.netlify.app"
]);
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('❌ Not allowed by CORS!'));
        }
    },
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    credentials: true
};

app.use(helmet());
app.use(rateLimiter({ max: 250 }));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/note", noteRoutes);

app.use((req, res) => {
    res.status(404).json({ status: false, message: "Path not found!" });
});
app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(`❌ Error stack trace: ${err.stack}`); // Full error stack trace
        console.log('Request body:', req.body); // Log the incoming request body
        console.log('Request params:', req.params); // Log route parameters
    }
    res.status(err.status || 500).json({ status: false, message: err.message || "Server error. Please try again later!" });
});

