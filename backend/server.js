import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session'
import bodyParser from 'body-parser';
import cors from 'cors';
import connectFlash from 'connect-flash';
import path from 'path';

// Routes
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import blogRoutes from './routes/blogRoutes.js';

const PORT = 5000;
const app = express();

//Passport config
import passportConfig from './config/passport.js'; 
passportConfig(passport);

//DB config
const dbURI = 'mongodb://localhost:27017/PlacesToStay';

//Connect to MongoDB
mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(error => console.error(error))
    
//Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Update this as per your client app's URL
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Ensure the SESSION_SECRET is being read correctly
console.log('Session secret:', process.env.SESSION_SECRET);

app.use(session({
    secret: process.env.SESSION_SECRET,
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

//API Routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/blogs', blogRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(PORT, () => {
    console.log(`server is listening on port ${PORT}`)
});