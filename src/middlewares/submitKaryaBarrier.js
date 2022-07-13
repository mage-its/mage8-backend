const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');

const submitKaryaBarrier = () => (req, res, next) => {
  if(req.user.registeredComp==='gamedev'){
    const id = req.user.id;
    const compe = getCompeByUserId(id);
    const cabang = compe.kategori === "Siswa" ? "gdevs" : "gdevm";
    const kodebayar = getKodeBayarByCabang(cabang);
    if(kodebayar.isKaryaClose){
      req.status(httpStatus.FORBIDDEN).send({
        code: httpStatus.FORBIDDEN,
        message: 'Masa Upload Karya Telah Lewat!'
      })
    }
    else next();
  }

  else if(req.user.registeredComp==='appdev'){
    const id = req.user.id;
    const compe = getCompeByUserId(id);
    const cabang = compe.kategori === "Siswa" ? "adevs" : "adevm";
    const kodebayar = getKodeBayarByCabang(cabang);
    if(kodebayar.isKaryaClose){
      req.status(httpStatus.FORBIDDEN).send({
        code: httpStatus.FORBIDDEN,
        message: 'Masa Upload Karya Telah Lewat!'
      })
    }
    else next();
  }

  else if(req.user.registeredComp==='iotdev'){
    const cabang = "idev";
    const kodebayar = getKodeBayarByCabang(cabang);
    if(kodebayar.isKaryaClose){
      req.status(httpStatus.FORBIDDEN).send({
        code: httpStatus.FORBIDDEN,
        message: 'Masa Upload Karya Telah Lewat!'
      })
    }
    else next();
  }
}

// const submitKaryaBarrier = () => (req, res, next) => {
//   if (config.close.submitKarya) {
//     res.status(httpStatus.FORBIDDEN).send({
//       code: httpStatus.FORBIDDEN,
//       message: `Pengumpulan karya sudah ditutup`,
//     });
//   } else next();
// };

module.exports = submitKaryaBarrier;
