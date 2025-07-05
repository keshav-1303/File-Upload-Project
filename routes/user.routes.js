// User ke saare routes yaha honge

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// 13. Import User model
const User = require('../models/user.model');

// router.get('/test', (req, res) => {
//     res.send('User Test Route');
// });

// 6. Now we will create route for user to 'Register' (in views folder)
router.get('/register', (req, res) => {
    res.render('register');
});

// 7. What will happen after register
// router.post('/register', (req, res) => {
//     console.log(req.body);
//     res.send('User Registered');

// Route with validation for registration
router.post(
    '/register',
    body('email').trim().isEmail().withMessage('Please enter a valid email.'),
    body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'),
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long.'),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data',
            });
        }

        try {
            const { username, email, password } = req.body;

            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User with this email already exists.' });
            }

            // 16. use hashed password
            const hashedPassword = await bcrypt.hash(password, 10); // 10 is how many times hashed

            // 14. create a new user instance and save it
            const newUser = new User({
                username,
                email,
                password: hashedPassword,
            });

            await newUser.save();

            res.redirect('/user/login');
        } catch (error) {
            res.status(500).send('Server error');
        }
    }
);

// 17. Now we will create a route for 'Login' (in views folder)
router.get('/login', (req, res) => {
    res.render('login');
});

router.post(
    '/login',
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                errors: errors.array(),
                message: 'Invalid data',
            });
        }

        try {
            const { username, password } = req.body;

            const user = await User.findOne({
                username: username,
            });

            if (!user) {
                return res.status(404).json({
                    message: 'Username or Password is INCORRECT!',
                });
            }

            // Now we will compare the password
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(404).json({
                    message: 'Username or Password is INCORRECT!',
                });
            }

            // 18. Use JWT for login
            const token = jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                    username: user.username,
                },
                process.env.JWT_SECRET
            );

            // 19. Now, we will use cookies to store the token (use package cookie-parser)
            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' }); // (name of value, actual value)

            res.redirect('/home');
        } catch (error) {
            res.status(500).send('Server error');
        }
    }
);

router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/user/login');
});

// Read (Get) a single user by ID
router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password'); // Exclude password
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Server error');
    }
});

// Update a user by ID
router.put('/profile/:id', async (req, res) => {
    try {
        const { username, email } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { username, email },
            { new: true, runValidators: true }
        ).select('-password'); // Exclude password
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Server error');
    }
});

// Delete a user by ID
router.delete('/profile/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Server error');
    }
});

// export the route
module.exports = router;
