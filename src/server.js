import app from './app.js';
import knex from 'knex';
import { PORT, DATABASE_URL } from './config.js';

//  pg returns number values as strings
//  this converts bigint type to int
import pg from 'pg';
const { types } = pg;
types.setTypeParser(20, function(val) {
  return parseInt(val);
});

const db = knex({
  client: 'pg',
  connection: DATABASE_URL,
});

app.set('db', db);

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
