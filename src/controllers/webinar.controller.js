const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { webinarService } = require('../services');

const daftarWebinar = catchAsync(async(req,res)=>{
    const peserta = await webinarService.daftarWebinar(req.body,req.files);
    res.status(httpStatus.CREATED).send(peserta);
})

const getWebinars = catchAsync(async(req,res)=>{
    const filter = pick(req.query, ['isVerified']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);
    const peserta = await webinarService.queryWebinars(filter,options);
    res.send(peserta);
})


module.exports = {
    daftarWebinar,
    getWebinars,
  };
  