// Import necessary modules
const express = require('express');
const path = require('path');
const app = express();
const passport = require('passport');
const session = require('express-session');

// Set the port for the server
const port = 1234;

// Import authentication configurations
require('./authentication/googleauth');
require('./authentication/facebookauth');

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the "client" directory
app.use(express.static(path.join(__dirname, "client")));

// Middleware to check if the user is logged in
function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401); // If user is authenticated, proceed to next middleware, otherwise send 401 Unauthorized
}

// Route to serve the home page
app.get('/', (req, res) => {
    res.sendFile('index.html'); // Send the index.html file
});

// Configure session management
app.use(session({
    secret: 'keyboard cat', // Secret key for session encryption
    resave: false,          // Do not save session if unmodified
    saveUninitialized: false, // Do not create session until something is stored
    cookie: { secure: false } // Set cookie to secure false, should be true in production with HTTPS
}));

// Initialize Passport and use session management
app.use(passport.initialize());
app.use(passport.session());

// Route to initiate Google authentication
app.get('/auth/google', 
  passport.authenticate('google', { scope: ['email', 'profile'] }) // Request email and profile information
);

// Route to initiate Facebook authentication
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] }) // Request email and public profile information
);

// Callback route for Facebook authentication
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/auth/protected', // Redirect to protected route on success
    failureRedirect: '/auth/failure'    // Redirect to failure route on failure
  })
);

// Callback route for Google authentication
app.get('/auth/google/callback', 
  passport.authenticate('google', {
    successRedirect: '/auth/protected', // Redirect to protected route on success
    failureRedirect: '/auth/failure'    // Redirect to failure route on failure
  })
);

// Protected route, accessible only if logged in
app.get('/auth/protected', isLoggedIn, (req, res) => {
    let name = req.user.displayName;
    let id = req.user.id;
    let provider = req.user.provider;
    res.send(`Name: ${name}<br>Id: ${id}<br>Provider: ${provider}`); // Display user information
});

// Failure route, in case of authentication failure
app.get('/auth/failure', (req, res) => {
    res.send("something went wrong"); // Inform user of failure
});

// Route to handle logout
app.use('/auth/logout', (req, res) => {
    req.session.destroy(); // Destroy the session
    res.send('See you again'); // Send a goodbye message
});

// Start the server
app.listen(port, () => {
    console.log("listening on port " + port); // Log the port the server is running on
});