const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const docsRoute = require('./docs.route');
const olimRoute = require('./olim.route');
const gameDevRoute = require('./gameDev.route');
const appDevRoute = require('./appDev.route');
const iotDevRoute = require('./iotDev.route');
const announcementRoute = require('./announcement.route');
const kodeBayarRoute = require('./kodeBayar.route');
const compeRoute = require('./compe.route');
const kodePromoRoute = require('./kodePromo.route');
const tokenRoute = require('./token.route');
const linkShortenerRoute = require('./linkShortener.route');
const webinarRoute = require('./webinar.route');
const workshopRoute = require('./workshop.route');
const linkShortenerController = require('../../controllers/linkShortener.controller');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/olim',
    route: olimRoute,
  },
  {
    path: '/gamedev',
    route: gameDevRoute,
  },
  {
    path: '/appdev',
    route: appDevRoute,
  },
  {
    path: '/iotdev',
    route: iotDevRoute,
  },
  {
    path: '/announcement',
    route: announcementRoute,
  },
  {
    path: '/kodebayar',
    route: kodeBayarRoute,
  },
  {
    path: '/compe',
    route: compeRoute,
  },
  {
    path: '/kodepromo',
    route: kodePromoRoute,
  },
  {
    path: '/tokens',
    route: tokenRoute,
  },
  {
    path:'/linkshortener',
    route: linkShortenerRoute,
  },
  {
    path:'/webinar',
    route: webinarRoute,
  },
  {
    path:'/workshop',
    route: workshopRoute,
  }
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

router.get('/:slug', linkShortenerController.requestHandler )


module.exports = router;
