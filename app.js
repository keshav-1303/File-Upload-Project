const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

// Routers
const indexRouter = require('./routes/index.routes');
const userRouter = require('./routes/user.routes');

// Middleware
const isLoggedIn = require('./middleware/auth');

// Load env variables
dotenv.config();

// DB connection
const connectDB = require('./config/database');
connectDB();

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Method override for PUT/DELETE
app.use(methodOverride('_method'));

// Cookie parser
app.use(cookieParser());

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);

// Start server
app.listen(3000, () => {
  console.log('Server running at port 3000');
});
