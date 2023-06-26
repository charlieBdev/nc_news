const data = require('../data/development-data');
const seed = require('../seeds/seed');

// path ok?
// default was ./
const db = require('../');

seed(data).then(() => {
  return db.end();
});