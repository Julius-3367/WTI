const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const prisma = require('./database');
const { generateTokenPair } = require('./jwt');

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_CALLBACK_URL = process.env.GOOGLE_CALLBACK_URL;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL) {
  console.warn('⚠️  Missing Google OAuth environment variables. Google login will not work properly.');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    },
    async (_req, _accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('Google account email not available'));
        }

        const firstName = profile.name?.givenName || 'Google';
        const lastName = profile.name?.familyName || 'User';

        // Find existing user by email
        let user = await prisma.user.findUnique({
          where: { email },
          include: { role: true },
        });

        if (!user) {
          const defaultRole = await prisma.role.findFirst({ where: { name: 'Candidate' } });
          if (!defaultRole) {
            return done(new Error('Default role not found for new Google user')); 
          }

          user = await prisma.user.create({
            data: {
              email,
              password: '',
              firstName,
              lastName,
              roleId: defaultRole.id,
              isActive: true,
              lastLogin: new Date(),
            },
            include: { role: true },
          });
        } else {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() },
            include: { role: true },
          });
        }

        // Generate token pair
        const tokenPair = generateTokenPair(user);

        // Persist refresh token on user
        await prisma.user.update({
          where: { id: user.id },
          data: { refreshToken: tokenPair.refreshToken },
        });

        // Attach tokens for later middleware
        const authPayload = {
          user,
          accessToken: tokenPair.accessToken,
          refreshToken: tokenPair.refreshToken,
        };

        return done(null, authPayload);
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

module.exports = passport;
