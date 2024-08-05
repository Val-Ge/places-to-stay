import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session'
import bodyParser from 'body-parser';
import cors from 'cors';
import connectFlash from 'connect-flash';
const PORT = 5000;
const app = express();

//Passport config
import passportConfig from './config/passport,js'; 
passportConfig(passport);

//DB config
// const db = process.env.Mongo_URI;

//Connect to MongoDB
mongoose.connect('mongodb://localhost:5000/PlacesToStay', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(error => console.error(error))
    
//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    seret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(connectFlash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import messageRoutes from './routes/messageRoutes.js';

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/messages', messageRoutes);

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});