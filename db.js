// db config
const pgp = require('pg-promise')({
  // init options
});
const conn = 'postgres://postgres:dasier256@127.0.0.1:5432/postgres';
const db = pgp(conn);

module.exports = db;