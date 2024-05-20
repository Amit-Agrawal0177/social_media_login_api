const addlogin = require('../model/add'); // Importing the module responsible for adding login information to the database
const passport = require('passport'); // Importing Passport.js for authentication
const FacebookStrategy = require('passport-facebook').Strategy; // Importing Facebook authentication strategy for Passport
require('dotenv').config(); // Loading environment variables from .env file

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID, // Facebook App ID
    clientSecret: process.env.FACEBOOK_APP_SECRET, // Facebook App Secret
    callbackURL: "http://localhost:1234/auth/facebook/callback", // URL to which Facebook will redirect after authentication
    profileFields: ['id', 'displayName', 'email'] // Specify additional profile fields you want to retrieve
  },
  function(accessToken, refreshToken, profile, done) {
    // The user's Facebook profile information is available in the `profile` parameter

    // Constructing a user profile object
    let userProfile = {
      email: profile.emails[0].value, // Extracting email from the profile
      displayName: profile.displayName, // Extracting display name from the profile
      id: profile.id, // Extracting Facebook ID from the profile
      provider: profile.provider // Storing the authentication provider (Facebook in this case)
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
