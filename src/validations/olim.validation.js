const Joi = require('joi').extend(require('joi-phone-number'));
const { objectId } = require('./custom.validation');

const daftarOlim = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30).required(),
      namaKetua: Joi.string().trim().min(1).max(100).required(),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      lineKetua: Joi.string().required().min(1).max(100),
      namaAnggota1: Joi.string().trim().allow('').max(100),
      namaAnggota2: Joi.string().trim().allow('').max(100),
      asalInstansi: Joi.string().trim().min(1).max(100).required(),
      alamatInstansi: Joi.string().trim().min(1).max(100).required(),
      asalKota: Joi.string().trim().min(1).max(100).required(),
      asalProvinsi: Joi.string().trim().min(1).max(100).required(),
      asalInfo: Joi.string().trim().min(1).max(100).required(),
      pathIdentitasKetua: Joi.string().trim().min(1).required(),
      pathIdentitasAnggota1: Joi.string().trim().min(1),
      pathIdentitasAnggota2: Joi.string().trim().min(1),
    })
    .with('namaAnggota2', 'namaAnggota1'),
};

const updateProfile = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().max(30).allow(''),
      namaKetua: Joi.string().trim().max(100).allow(''),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).allow(''),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).allow(''),
      lineKetua: Joi.string().max(100).allow(''),
      namaAnggota1: Joi.string().trim().max(100).allow(''),
      namaAnggota2: Joi.string().trim().max(100).allow(''),
      asalInstansi: Joi.string().trim().max(100).allow(''),
      alamatInstansi: Joi.string().trim().max(100).allow(''),
      asalKota: Joi.string().trim().max(100).allow(''),
      asalInfo: Joi.string().trim().max(100).allow(''),
      pathIdentitasKetua: Joi.string().trim().min(1).max(100),
      pathIdentitasAnggota1: Joi.string().trim().min(1).max(100),
      pathIdentitasAnggota2: Joi.string().trim().min(1).max(100),
    })
    .min(1),
};

const createOlim = {
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().min(1).max(30).required(),
      namaKetua: Joi.string().trim().min(1).max(100).required(),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).required(),
      lineKetua: Joi.string().required().min(1).max(100),
      namaAnggota1: Joi.string().trim().allow('').max(100),
      namaAnggota2: Joi.string().trim().allow('').max(100),
      asalInstansi: Joi.string().trim().min(1).max(100).required(),
      alamatInstansi: Joi.string().trim().min(1).max(100).required(),
      asalKota: Joi.string().trim().min(1).max(100).required(),
      asalInfo: Joi.string().trim().min(1).max(100).required(),
      pathIdentitasKetua: Joi.string().trim().min(1).max(100).required(),
      pathIdentitasAnggota1: Joi.string().trim().min(1).max(100),
      pathIdentitasAnggota2: Joi.string().trim().min(1).max(100),
    })
    .with('namaAnggota2', 'namaAnggota1'),
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const checkTeamName = {
  body: Joi.object().keys({
    namaTim: Joi.string().trim().min(1).max(30).required(),
  }),
};

const getOlims = {
  query: Joi.object().keys({
    isVerified: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getOlim = {
  params: Joi.object().keys({
    olimId: Joi.string().custom(objectId),
  }),
};

const updateOlim = {
  params: Joi.object().keys({
    olimId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      namaTim: Joi.string().trim().max(30).allow(''),
      namaKetua: Joi.string().trim().max(100).allow(''),
      hpKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).allow(''),
      waKetua: Joi.string().trim().phoneNumber({ defaultCountry: 'ID', strict: true }).allow(''),
      lineKetua: Joi.string().max(100).allow(''),
      namaAnggota1: Joi.string().trim().max(100).allow(''),
      namaAnggota2: Joi.string().trim().max(100).allow(''),
      asalInstansi: Joi.string().trim().max(100).allow(''),
      alamatInstansi: Joi.string().trim().max(100).allow(''),
      asalKota: Joi.string().trim().max(100).allow(''),
      asalInfo: Joi.string().trim().max(100).allow(''),
      pathIdentitasKetua: Joi.string().trim().min(1).max(100),
      pathIdentitasAnggota1: Joi.string().trim().min(1).max(100),
      pathIdentitasAnggota2: Joi.string().trim().min(1).max(100),
      price: Joi.string()
        .regex(/^[1-9]\d\d?\.\d{3}$/)
        .allow(''),
      isVerified: Joi.boolean(),
    })
    .min(1),
};

const deleteOlim = {
  params: Joi.object().keys({
    olimId: Joi.string().custom(objectId),
  }),
};

const toggleVerif = {
  params: Joi.object().keys({
    olimId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  daftarOlim,
  updateProfile,
  createOlim,
  getOlims,
  getOlim,
  updateOlim,
  deleteOlim,
  toggleVerif,
  checkTeamName,
};
