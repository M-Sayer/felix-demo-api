const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://localhost/amina';
const JWT_SECRET = process.env.JWT_SECRET || 'not_a_working_secret';
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_FROM = process.env.SMTP_FROM
const SMTP_PW = process.env.SMTP_PW

export {
  PORT, NODE_ENV, DATABASE_URL, JWT_SECRET, SMTP_HOST, SMTP_FROM, SMTP_PW
}
