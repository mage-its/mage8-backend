const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');

const registerBarrier = (category) => async (req, res, next) => {
  if (category === 'olim') {
    try {
      const kodebayar = await getKodeBayarByCabang(category);
      if (kodebayar.isClose) {
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Development Competition Sudah Ditutup!',
        });
      } else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  } else if (category === 'gamedev') {
    const cabang = 'gdevs';
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if (kodebayar.isClose) {
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Development Competition Sudah Ditutup!',
        });
      } else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  } else if (category === 'appdev') {
    const cabang = 'adevm';
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if (kodebayar.isClose) {
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Development Competition Sudah Ditutup!',
        });
      } else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  } else if (category === 'iotdev') {
    const cabang = 'idev';
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if (kodebayar.isClose) {
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Development Competition Sudah Ditutup!',
        });
      } else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message);
    }
  }

  // if (config.close[category]) {
  //   res.status(httpStatus.FORBIDDEN).send({
  //     code: httpStatus.FORBIDDEN,
  //     message: `Registrasi ${category} sudah ditutup`,
  //   });
  // } else next();
};

module.exports = registerBarrier;
