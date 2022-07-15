const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');



// const cat = {
//   olim: 'paymentOlim',
// };

const paymentBarrier = () => async(req, res, next) => {
  if(req.user.registeredComp==='olim'){
    try {
      const kodebayar = await getKodeBayarByCabang("olim");
      if(kodebayar.isPaymentClose){
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Olimpiade Sudah Ditutup!'
        })
      }
      else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message)
    }
  }

  else if(req.user.registeredComp==='gamedev'){
    const id = req.user.id;
    try {
      const compe = await getCompeByUserId(id);
      const cabang = compe.kategori === "Siswa" ? "gdevs" : "gdevm";
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isPaymentClose){
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Olimpiade Sudah Ditutup!'
        })
      }
      else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message)
    }
  }
    

  else if(req.user.registeredComp==='appdev'){
    const id = req.user.id;
    try {
      const compe = await getCompeByUserId(id);
      const cabang = compe.kategori === "Siswa" ? "adevs" : "adevm";
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isPaymentClose){
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Development Competition Sudah Ditutup!'
        })
      }
      else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message)
    }
  }

  else if(req.user.registeredComp==='iotdev'){
    const cabang = "idev";
    try {
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isPaymentClose){
        res.status(httpStatus.FORBIDDEN).send({
          code: httpStatus.FORBIDDEN,
          message: 'Pembayaran Development Competition Sudah Ditutup!'
        })
      }
      else next();
    } catch (error) {
      res.status(httpStatus.NOT_FOUND).send(error.message)
    }
  }

  // if (config.close[cat[req?.user?.registeredComp]]) {
  //   res.status(httpStatus.FORBIDDEN).send({
  //     code: httpStatus.FORBIDDEN,
  //     message: `Pembayaran ${req.user.registeredComp === 'olim' ? 'Olimpiade' : 'Development Competition'} sudah ditutup`,
  //   });
  // } else next();
};

module.exports = paymentBarrier;
