require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { connect, disconnect } = require('./helpers/db');

before(async () => {
  await connect();
});

after(async () => {
  await disconnect();
});