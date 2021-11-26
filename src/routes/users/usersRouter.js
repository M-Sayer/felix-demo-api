import { Router } from 'express';
import { requireAuth } from '../../middleware/jwtAuth.js';

import { UsersService } from './UsersService.js';
import { convertToDollars } from '../../helpers.js';
import  { sendEmail } from '../../../utils/sendEmail.js';

const { 
  createUser, 
  getUserWithEmail, 
  createAuthToken, 
  createEmailToken, 
  verifyEmailToken, 
  getUserWithId, 
  createJwt 
} = UsersService;

export const usersRouter = Router();

usersRouter.post('/register', async (req, res, next) => {
  const db = req.app.get('db');

  const { firstName, lastName, email } = req.body;

  for (const field of [
    'firstName',
    'lastName',
    'email',
  ]) {
    if (!req.body[field]) {
      return res.status(400).json({
        error: `Missing ${field} in request body`,
      });
    }
  }

  try {
    // Check if email already exists in db
    const hasEmail = await getUserWithEmail(db, email);

    // If email is already taken return error
    if (hasEmail) {
      return res.status(400).json({
        error: 'Email already in use',
      });
    }

    // Build new user object
    const newUser = {
      first_name: firstName,
      last_name: lastName,
      email,
    };

    // Insert new user object into database
    const user = await createUser(db, newUser);

    // Get user id and username from db to create jwt token
    const sub = user.username;
    const payload = { user_id: user.id };

    // Create and send jwt
    res.status(200).json({
      authToken: createJwt(sub, payload),
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.post('/login', async (req, res, next) => {
  const db = req.app.get('db');
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      error: `Missing email in request body`,
    });
  }

  try {
    const user = await getUserWithEmail(db, email);

    if (!user) {
      return res.status(401).json({
        error: 'User does not exist'
      });
    }

    await sendEmail(createEmailToken({ userId: user.id }));

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
});

usersRouter.post(
  '/login/token',
  async (req, res, next) => {
    try {
      const { token } = req.body;
      const decoded = await verifyEmailToken(token);

      if (decoded.name === 'TokenExpiredError') {
        return res.status(401).json({
          error: 'Token Expired'
        })
      }

      return res.json({
        authToken: createAuthToken({ userId: decoded.userId })
      })
      
    } catch(e) {
      next(error)
    }
  }
)

usersRouter.route('/').get(requireAuth, async (req, res, next) => {
  const db = req.app.get('db');
  const user_id = req.userId;

  try {
    const user = await getUserWithId(db, user_id); // Returns an array of user details obj
    user.allowance = convertToDollars(user.allowance);
    user.balance = convertToDollars(user.balance);
    user.total_saved = convertToDollars(user.total_saved);
    return res.json(user); // Returns a user obj
  } catch (error) {
    next(error);
  }
});
