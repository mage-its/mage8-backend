const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');

const proposalBarrier = () => async(req, res, next) => {
  if(req.user.registeredComp==='gamedev'){
    const id = req.user.id;
    try {
      const compe = await getCompeByUserId(id);
      const cabang = compe.kategori === "Siswa" ? "gdevs" : "gdevm";
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isProposalClose){
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Masa Upload Proposal Telah Lewat!'
        })
      }
    else next();
    } catch (error) {
      res.status(httpStatus.FORBIDDEN).send(error.message)
    } 
  }

  else if(req.user.registeredComp==='appdev'){
    const id = req.user.id;
    try {
      const compe = await getCompeByUserId(id);
      const cabang = compe.kategori === "Siswa" ? "adevs" : "adevm";
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isProposalClose){
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Masa Upload Proposal Telah Lewat!'
        })
      }
    else next();
    } catch (error) {
      res.status(httpStatus.FORBIDDEN).send(error.message)
    }
  }

  else if(req.user.registeredComp==='iotdev'){
    const cabang = "idev";
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isProposalClose){
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Masa Upload Proposal Telah Lewat!'
        })
      }
    else next();
    } catch (error) {
      res.status(httpStatus.FORBIDDEN).send(error.message)
    }
  }
}
// const proposalBarrier = () => (req, res, next) => {
//   if (config.close.proposal) {
//     res.status(httpStatus.FORBIDDEN).send({
//       code: httpStatus.FORBIDDEN,
//       message: `Pengumpulan proposal sudah ditutup`,
//     });
//   } else next();
// };

module.exports = proposalBarrier;
