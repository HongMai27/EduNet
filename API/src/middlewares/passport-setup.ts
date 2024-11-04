import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/userModel';

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user || undefined);
  } catch (error) {
    done(error as Error, undefined); 
  }
});

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // find user
    let existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }
    
    // if !user, create new user
    const newUser = await new User({
      googleId: profile.id,
      username: profile.displayName,
      avatar: profile._json.picture,
    }).save();
    
    done(null, newUser);
  } catch (error) {
    done(error as Error, undefined); 
  }
}));
