const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { workshopService } = require('../services');

const daftarWorkshop = catchAsync(async (req, res) => {
  const peserta = await workshopService.daftarWorkshop(req.body, req.files);
  res.status(httpStatus.CREATED).send(peserta);
});

const getWorkshops = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['isVerified']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const peserta = await workshopService.queryWorkshop(filter, options);
  res.send(peserta);
});

module.exports = {
  daftarWorkshop,
  getWorkshops,
};
