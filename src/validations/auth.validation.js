const Joi = require('joi');
const { password } = require('./custom.validation');
const { useRecaptcha } = require('../config/config');

const register = {
  body: Joi.object().keys({
    email: Joi.string()
      .trim()
      .email({ tlds: { allow: ['com', 'net', 'org'] } })
      .required(),
    password: Joi.string().required().custom(password),
    name: Joi.string().trim().required(),
    recaptchaResponse: useRecaptcha ? Joi.string().required() : Joi.string(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

const googleLogin = {
  body: Joi.object().keys({
    idToken: Joi.string().required(),
  }),
};

const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
};

const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

module.exports = {
  register,
  login,
  googleLogin,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};
