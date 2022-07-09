const httpStatus = require('http-status');
const kodeBayarService = require('./kodeBayar.service');
const { Olim, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get olim by user id
 * @param {ObjectId} user
 * @returns {Promise<Olim>}
 */
const getOlimByUserId = async (user) => {
  return Olim.findOne({ user });
};

/**
 * Get olim by nama tim
 * @param {string} namaTim
 * @returns {Promise<Olim>}
 */
const getOlimByNamaTim = async (namaTim) => {
  return Olim.findOne({ namaTim });
};

/**
 * Register olim service
 * @param {Object} olimBody
 * @param {User} user
 * @returns {Promise<Array<Promise<Olim>, Promise<User>, Promise<KodeBayar>>>}
 */
const daftarOlim = async (olimBody,  user) => {
  const olim = new Olim(olimBody);

  if (!olimBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

 if(olimBody.namaAnggota1)
 {
  if(olimBody.pathIdentitasAnggota1)
  {
    if(olimBody.namaAnggota2 && !olimBody.pathIdentitasAnggota2)
    {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }
  else if(!olimBody.pathIdentitasAnggota1){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
  }
 }
  olim.user = user.id;

  const kode = await kodeBayarService.getKodeBayarByCabang('olim');

  const noUrut = kode.no.toString().padStart(3, '0');

  olim.noPeserta = `OLI0${noUrut}`;
  olim.price = kode.price + kode.no;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'olim';
  return Promise.all([olim.save(), user.save(), kodeBayarService.incNoUrut('olim', kode)]);
};

/**
 * Update olim by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {Olim} olimObj
 * @returns {Promise<Olim>}
 */
const updateOlimByUserId = async (userId, updateBody, olimObj = null) => {
  const olim = olimObj ?? (await getOlimByUserId(userId));
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(olim, updateBody);
  if (olim.pathIdentitasAnggota1 === null) {
    olim.namaAnggota1 = null;
  }
  if (olim.pathIdentitasAnggota2 === null) {
    olim.namaAnggota2 = null;
  }
  return olim.save();
};

/**
 * Create olim
 * @param {Object} olimBody
 * @param {ObjectId} userId
 * @returns {Promise<Array<Promise<Olim>, Promise<User>, Promise<KodeBayar>>>}
 */
const createOlim = async (olimBody, userId) => {
  const olim = new Olim(olimBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!olimBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

 if(olimBody.namaAnggota1)
 {
  if(olimBody.pathIdentitasAnggota1)
  {
    if(olimBody.namaAnggota2 && !olimBody.pathIdentitasAnggota2)
    {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }
  else if(!olimBody.pathIdentitasAnggota1){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
  }
 }

  olim.user = user.id;

  const kode = await kodeBayarService.getKodeBayarByCabang('olim');

  const noUrut = kode.no.toString().padStart(3, '0');

  olim.noPeserta = `OLI0${noUrut}`;
  olim.price = kode.price + kode.no;

  user.registeredComp = 'olim';
  return Promise.all([olim.save(), user.save(), kodeBayarService.incNoUrut('olim', kode)]);
};

/**
 * Query for olims
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryOlims = async (filter, options) => {
  const olims = await Olim.paginate(filter, options);
  return olims;
};

/**
 * Get olim by id
 * @param {ObjectId} id
 * @returns {Promise<Olim>}
 */
const getOlimById = async (id) => {
  return Olim.findById(id);
};

/**
 * Update olim by id
 * @param {ObjectId} olimId
 * @param {Object} updateBody
 * @param {Olim} olimObj
 * @returns {Promise<Olim>}
 */
const updateOlimById = async (olimId, updateBody, olimObj = null) => {
  const olim = olimObj ?? (await getOlimById(olimId));
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(olim, updateBody);
  if (olim.pathIdentitasAnggota1 === null) {
    olim.namaAnggota1 = null;
  }
  if (olim.pathIdentitasAnggota2 === null) {
    olim.namaAnggota2 = null;
  }
  return olim.save();
};

/**
 * Delete olim by id
 * @param {ObjectId} olimId
 * @returns {Promise<User>}
 */
const deleteOlimById = async (olimId, olimObj = null, userObj = null) => {
  const olim = olimObj ?? (await getOlimById(olimId));
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj ?? (await User.findById(olim.user));
  if (user) {
    user.registeredComp = '';
  }
  await Promise.all([olim.remove(), user.save()]);
  return olim;
};

/**
 * Toggle verification
 * @param {ObjectId} olimId
 * @param {Olim} [olimObj=null]
 * @returns {Promise<Olim>}
 */
const toggleVerif = async (olimId, username, olimObj = null) => {
  const olim = olimObj ?? (await getOlimById(olimId));
  if (!olim) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return updateOlimById(olim.id, { isVerified: !olim.isVerified, verifiedBy: username}, olim);
};

module.exports = {
  daftarOlim,
  queryOlims,
  createOlim,
  getOlimById,
  getOlimByUserId,
  getOlimByNamaTim,
  updateOlimById,
  updateOlimByUserId,
  deleteOlimById,
  toggleVerif,
};
