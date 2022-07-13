const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');


if(req.user.registeredComp==='gamedev'){
  const id = req.user.id;
  const compe = getCompeByUserId(id);
  const cabang = compe.kategori === "Siswa" ? "gdevs" : "gdevm";
  const kodebayar = getKodeBayarByCabang(cabang);
  if(kodebayar.isProposalClose){
    req.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: 'Masa Upload Proposal Telah Lewat!'
    })
  }
  else next();
}

else if(req.user.registeredComp==='appdev'){
  const id = req.user.id;
  const compe = getCompeByUserId(id);
  const cabang = compe.kategori === "Siswa" ? "adevs" : "adevm";
  const kodebayar = getKodeBayarByCabang(cabang);
  if(kodebayar.isProposalClose){
    req.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: 'Masa Upload Proposal Telah Lewat!'
    })
  }
  else next();
}

else if(req.user.registeredComp==='iotdev'){
  const cabang = "idev";
  const kodebayar = getKodeBayarByCabang(cabang);
  if(kodebayar.isProposalClose){
    req.status(httpStatus.FORBIDDEN).send({
      code: httpStatus.FORBIDDEN,
      message: 'Masa Upload Proposal Telah Lewat!'
    })
  }
  else next();
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
