// Importing the module responsible for adding login information to the database
const addlogin = require('../model/add');

// Importing Passport.js for authentication
const passport = require('passport');

// Importing Google authentication strategy for Passport
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Loading environment variables from .env file
require('dotenv').config();

// Setting up Google authentication strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID, // Google Client ID
    clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Google Client Secret
    callbackURL: "http://localhost:1234/auth/google/callback" // URL to which Google will redirect after authentication
  },
  function(accessToken, refreshToken, profile, done) {
    // The user's Google profile information is available in the `profile` parameter

    // Constructing a user profile object
    let userProfile = {
        email: profile.emails[0].value, // Extracting email from the profile
        displayName: profile.displayName, // Extracting display name from the profile
        id: profile.id, // Extracting Google ID from the profile
        provider: profile.provider // Storing the authentication provider (Google in this case)
      };
      
      // Adding the user's login information to the database
      addlogin.fgloginadd(userProfile, (err, id) => {
        if(err) {
          console.log(err); // Logging error, if any
        } else {
          console.log(id); // Logging the ID of the added login information
        }
      });
      
      console.log(userProfile); // Logging the user profile
      
      done(null, profile); // Pass the profile to the next step
    }
));

// Serialization and deserialization of user
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
