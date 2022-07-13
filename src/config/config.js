module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    url: process.env.MONGODB_URL + (process.env.NODE_ENV === 'test' ? '-test' : ''),
    options: {},
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      name: process.env.EMAIL_NAME,
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
    senderName: process.env.EMAIL_NAME,
  },
  url: process.env.APP_URL,
  firepw: process.env.FIREBASE_PW,
  frontend: process.env.FRONTEND_PATH,
  cors: process.env.CORS_ORIGIN,
  useRecaptcha: process.env.USE_RECAPTCHA === 'true',
  recaptchaSecret: process.env.RECAPTCHA_SECRET,
  maintenance: process.env.MAINTENANCE,
  logging: process.env.LOGGING === 'true',
  close: {
    olim: process.env.CLOSE_OLIM === 'true',
    devcom: process.env.CLOSE_DEVCOM === 'true',
    proposal: process.env.CLOSE_PROPOSAL === 'true',
    paymentOlim: process.env.CLOSE_PAYMENT_OLIM === 'true',
    submitKarya: process.env.CLOSE_SUBMIT_KARYA === 'true',
  },
  rajaOngkirKey: process.env.RAJA_ONGKIR_API_KEY,
};
