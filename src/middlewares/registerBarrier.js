const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');


const registerBarrier = (category) => (req, res, next) => {
  if(req.user.registeredComp==='olim'){
    const kodebayar = getKodeBayarByCabang(olim);
    if(kodebayar.isClose){
      req.status(httpStatus.FORBIDDEN).send({
        code: httpStatus.FORBIDDEN,
        message: 'Pembayaran Olimpiade Sudah Ditutup!'
      })
    }
    else next();
  }

  else if(req.user.registeredComp==='gamedev'){
    const id = req.user.id;
    const compe = getCompeByUserId(id);
    const cabang = compe.kategori === "Siswa" ? "gdevs" : "gdevm";
    const kodebayar = getKodeBayarByCabang(cabang);
    if(kodebayar.isClose){
      req.status(httpStatus.FORBIDDEN).send({
        code: httpStatus.FORBIDDEN,
        message: 'Pembayaran Development Competition Sudah Ditutup!'
      })
    }
    else next();
  }

  else if(req.user.registeredComp==='appdev'){
    const id = req.user.id;
    const compe = getCompeByUserId(id);
    const cabang = compe.kategori === "Siswa" ? "adevs" : "adevm";
    const kodebayar = getKodeBayarByCabang(cabang);
    if(kodebayar.isClose){
      req.status(httpStatus.FORBIDDEN).send({
        code: httpStatus.FORBIDDEN,
        message: 'Pembayaran Development Competition Sudah Ditutup!'
      })
    }
    else next();
  }

  else if(req.user.registeredComp==='iotdev'){
    const cabang = "idev";
    const kodebayar = getKodeBayarByCabang(cabang);
    if(kodebayar.isClose){
      req.status(httpStatus.FORBIDDEN).send({
        code: httpStatus.FORBIDDEN,
        message: 'Pembayaran Development Competition Sudah Ditutup!'
      })
    }
    else next();
  }

  // if (config.close[category]) {
  //   res.status(httpStatus.FORBIDDEN).send({
  //     code: httpStatus.FORBIDDEN,
  //     message: `Registrasi ${category} sudah ditutup`,
  //   });
  // } else next();
};

module.exports = registerBarrier;
