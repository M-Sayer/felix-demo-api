import { UsersService } from '../routes/users/UsersService.js';

const { verifyJwt, verifyAuthToken, getUserWithId } = UsersService;

export async function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';
  const db = req.app.get('db');

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  } else {
    bearerToken = authToken.slice('bearer '.length, authToken.length);
  }

  try {
    const auth = verifyAuthToken(bearerToken);
    const user = await getUserWithId(db, auth.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized request'
      });
    }
 
    req.userId = user.id;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
}