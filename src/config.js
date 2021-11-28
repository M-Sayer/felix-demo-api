const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost/amina';
const JWT_SECRET = process.env.JWT_SECRET || 'not_a_working_secret';

export {
  PORT, NODE_ENV, DATABASE_URL, JWT_SECRET
}
