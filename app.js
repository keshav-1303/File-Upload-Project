const express = require('express');
const path = require('path');
const methodOverride = require('method-override');

// 4. import routers for using all the routes
const userRouter = require('./routes/user.routes')

const cookieParser = require('cookie-parser');

const indexRouter = require('./routes/index.routes');
const isLoggedIn = require('./middleware/auth');

// 15. Password must not be sent in plaintext (UNSAFE)
// So install bcrypt

// 10. Database & dotenv setup
const dotenv = require('dotenv')
dotenv.config();    // puree app me .env ka access mil jata h

// 11. Datavase connection
const connectDB = require('./config/database');
connectDB();

// 12. Now we have to make schema for our user

const app = express();

// 1. Setup ejs (Make views folder and index.ejs inside that)
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// 8. Now data will be shown in terminal(console)
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(cookieParser());

// 9. Now we have to check if data is correct -> use express-validator

// app.get('/', (req, res) => {
    //     res.send("Hello");
    // })
    
    // 2. render whats inside index.ejs (prev one was for basic setup)
    // app.get('/', (req, res) => {
        //     res.render("index");
        // })

app.use('/', indexRouter);   // '/home' will act as '/' 

// 5. routing so remove prev one
app.use('/user', userRouter);   // username, userRouter (now route will be '/user/test')

// 3. for routing, create routes folder

app.listen(3000, (req, res) => {
    console.log('Server running at port 3000');
})