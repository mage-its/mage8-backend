const admin = require('firebase-admin');
const config = require('./config');

// eslint-disable-next-line import/no-unresolved

if (config.env !== 'ci') {
  admin.initializeApp({
    credential: admin.credential.cert(config.firebaseAccountKey),
  });
}

module.exports = admin;
