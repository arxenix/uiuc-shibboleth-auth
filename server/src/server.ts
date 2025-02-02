// import bodyParser from 'body-parser';
import crypto from 'crypto';
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import { ShibbolethStrategy, type AuthenticatedShibbolethUser } from './auth/shibboleth.js';
import { init } from './connections/discord/index.js';
import config from './config.js';

const port = config.PORT;

init();
const app = express();

passport.use(ShibbolethStrategy);

app.get('/', (req, res) => {
  res.send('Pong 2');
});

app.get(
  '/shibboleth/login',
  passport.authenticate('saml', {
    session: false, //TODO
    successRedirect: '/?success=1', // these aren't used since the identity provider redirects to a configured callback URL
    failureRedirect: '/?failure=1', // these aren't used since the identity provider redirects to a configured callback URL
  })
);

app.post(
  '/shibboleth/callback',
  express.urlencoded({ extended: false }),
  passport.authenticate('saml', {
    session: false,
    failureRedirect: '/?failure=2',
    failureFlash: true
  }),
  async (req, res) => {
    // Show the user profile on the page
    if (!req.user) {
      return res.redirect('/?failure=3');
    }
    const user = req.user as AuthenticatedShibbolethUser;
    res.send(`Hello ${user.uid}`);
    // Set the user's session cookie
    const token = jwt.sign(
      { user },
      config.JWT_SECRET,
      { expiresIn: '10m' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    // res.redirect('/?success=3');
  }
);

app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post(
  '/api/v1/link',
  expressjwt({
    secret: config.JWT_SECRET,
    algorithms: ['HS256'],
  }),
  (req, res) => {
    // TODO: Link the user's Discord account
  }
);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});