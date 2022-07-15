const httpStatus = require('http-status');
const config = require('../config/config');
const { getCompeByUserId } = require('../services/compe.service');
const { getKodeBayarByCabang } = require('../services/kodeBayar.service');



// const cat = {
//   olim: 'paymentOlim',
// };

const paymentBarrier = async(registeredComp,id) => {
  if(registeredComp === "olim"){
    try {
      const cabang = "olim";
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isPaymentClose){
        return undefined;
      }
      else return 1;
    } catch (error) {
      return undefined;
    }
  }

  if(registeredComp === "appdev"){
    try {
      const compe = await getCompeByUserId(id);
      const cabang = compe.kategori === "Siswa" ? "adevs" : "adevm";
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isPaymentClose){
        return undefined;
      }
      else return 1;
    } catch (error) {
      return undefined;
    }
  }

  if(registeredComp === "gameev"){
    try {
      const compe = await getCompeByUserId(id);
      const cabang = compe.kategori === "Siswa" ? "adevs" : "adevm";
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isPaymentClose){
        return undefined;
      }
      else return 1;
    } catch (error) {
      return undefined;
    }
  }
  
  if(registeredComp === "iotdev"){
    try {
      const cabang = "idev"
      const kodebayar = await getKodeBayarByCabang(cabang);
      if(kodebayar.isPaymentClose){
        return undefined;
      }
      else return 1;
    } catch (error) {
      return undefined;
    }
  }
}

    


  // if (config.close[cat[req?.user?.registeredComp]]) {
  //   res.status(httpStatus.FORBIDDEN).send({
  //     code: httpStatus.FORBIDDEN,
  //     message: `Pembayaran ${req.user.registeredComp === 'olim' ? 'Olimpiade' : 'Development Competition'} sudah ditutup`,
  //   });
  // } else next();

module.exports = paymentBarrier;
