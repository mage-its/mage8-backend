const {
  olimService,
  gameDevService,
  compeService,
  appDevService,
  iotDevService,
  webinarService,
  workshopService,
} = require('../services');

const uploads = {
  olim: olimService.multiUploads,
  gamedev: gameDevService.multiUploads,
  appdev: appDevService.multiUploads,
  iotdev: iotDevService.multiUploads,
  gamedevProposal: gameDevService.multerProposal,
  appdevProposal: appDevService.multerProposal,
  iotdevProposal: iotDevService.multerProposal,
  payment: compeService.multiUploads,
  webinar: webinarService.multiUploads,
  workshop: workshopService.multiUploads,
};

const readForm = (key) => uploads[key];

module.exports = readForm;
