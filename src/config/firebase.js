const admin = require('firebase-admin');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const config = require('./config');

const client = new SecretManagerServiceClient();
// eslint-disable-next-line import/no-unresolved

client
  .accessSecretVersion({
    name: `projects/${process.env.GOOGLE_PROJECTID}/secrets/${process.env.SECRET_NAME}/versions/${process.env.SECRET_VERSION}`,
  })
  .then(async (response) => {
    const secret = response[0];
    const { data } = secret.payload;
    const secretData = JSON.parse(data);
    if (config.env !== 'ci') {
      admin.initializeApp({
        credential: admin.credential.cert(secretData),
      });
    }
  });

module.exports = admin;
