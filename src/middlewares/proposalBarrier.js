const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');

const proposalBarrier = (cabang) => async (req, res, next) => {
  if (cabang === 'gdevm') {
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if (kodebayar.isProposalClose) {
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Masa Upload Proposal Telah Lewat!',
        });
      } else next();
    } catch (error) {
      res.status(httpStatus.FORBIDDEN).send(error.message);
    }
  } else if (cabang === 'adevm') {
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if (kodebayar.isProposalClose) {
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Masa Upload Proposal Telah Lewat!',
        });
      } else next();
    } catch (error) {
      res.status(httpStatus.FORBIDDEN).send(error.message);
    }
  } else if (cabang === 'idev') {
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if (kodebayar.isProposalClose) {
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Masa Upload Proposal Telah Lewat!',
        });
      } else next();
    } catch (error) {
      res.status(httpStatus.FORBIDDEN).send(error.message);
    }
  }
};
// const proposalBarrier = () => (req, res, next) => {
//   if (config.close.proposal) {
//     res.status(httpStatus.FORBIDDEN).send({
//       code: httpStatus.FORBIDDEN,
//       message: `Pengumpulan proposal sudah ditutup`,
//     });
//   } else next();
// };

module.exports = proposalBarrier;
