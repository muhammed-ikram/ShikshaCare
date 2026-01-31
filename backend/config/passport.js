const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");

const JWT_SECRET = process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        let user = await userModel.findOne({ email });

        if (!user) {
          user = await userModel.create({
            username: profile.displayName,
            email,
            authProvider: "google",
            password: null
          });
        }

        const token = jwt.sign(
          { id: user._id, email: user.email },
          JWT_SECRET
        );

        done(null, { token });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
