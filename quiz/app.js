const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('./models/User');

const app = express();

// ✅ Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/quizDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ✅ Set view engine to EJS
app.set('view engine', 'ejs');

// ✅ Middleware
app.use(express.static('public'));

// ✅ FIX: Use extended: true to parse arrays (important!)
app.use(express.urlencoded({ extended: true }));

// ✅ Session & Passport setup
app.use(session({
    secret: 'quizsecret',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// ✅ Passport configuration
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ✅ Global middleware to pass current user and flash messages
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.messages = req.flash();
    next();
});

// ✅ Routes
app.use('/', require('./routes/index'));
app.use('/', require('./routes/auth'));

// ✅ Start server
app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});