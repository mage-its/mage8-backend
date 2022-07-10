const httpStatus = require('http-status');
const kodeBayarService = require('./kodeBayar.service');
const { IotDev, User } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Get iotdev by user id
 * @param {ObjectId} user
 * @returns {Promise<IotDev>}
 */
const getIotDevByUserId = async (user) => {
  return IotDev.findOne({ user });
};

/**
 * Get iotdev by nama tim
 * @param {string} namaTim
 * @returns {Promise<IotDev>}
 */
const getIotDevByNamaTim = async (namaTim) => {
  return IotDev.findOne({ namaTim });
};

/**
 * Register iotdev service
 * @param {Object} iotDevBody
 * @param {User} user
 * @returns {Promise<Array<Promise<IotDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const daftarIotDev = async (iotDevBody, user) => {
  const iotDev = new IotDev(iotDevBody);

  if (!iotDevBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

  if (iotDevBody.namaAnggota1) {
    if (iotDevBody.pathIdentitasAnggota1) {
      if (iotDevBody.namaAnggota2 && !iotDevBody.pathIdentitasAnggota2) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
      }
    } else if (!iotDevBody.pathIdentitasAnggota1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }

  if (!iotDevBody.pathBuktiUploadTwibbon || !iotDevBody.pathBuktiFollowMage || !iotDevBody.pathBuktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }

  iotDev.user = user.id;

  const cabang = 'idev';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = '1';

  iotDev.noPeserta = `DCI${noUrutPrefix}${noUrut}`;
  iotDev.price = kode.price + kode.no;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'iotdev';
  return Promise.all([iotDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

const checkTeamName = async (namaTim) => {
  const iotDev = await IotDev.findOne({ namaTim });
  if (iotDev) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Nama tim sudah terdaftar');
  }
};

/**
 * Upload proposal
 * @param {ObjectId} userId
 * @param {Object} iotDevBody
 * @returns {Promise<IotDev>}
 */
const uploadProposal = async (userId, iotDevBody) => {
  const iotDev = await getIotDevByUserId(userId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  if (iotDev.tahap !== 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Upload proposal hanya saat tahap 1, anda sekarang di tahap ${iotDev.tahap}`);
  }
  if (!iotDevBody.proposal?.[0]?.path) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File proposal harus diupload');
  }
  // Delete proposal if exist
  return iotDev.save();
};

/**
 * Update iotdev by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {IotDev} iotObj
 * @returns {Promise<IotDev>}
 */
const updateIotDevByUserId = async (userId, updateBody, iotObj = null) => {
  const iotDev = iotObj ?? (await getIotDevByUserId(userId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(iotDev, updateBody);
  if (iotDev.pathIdentitasAnggota1 === null) {
    iotDev.namaAnggota1 = null;
  }
  if (iotDev.pathIdentitasAnggota2 === null) {
    iotDev.namaAnggota2 = null;
  }
  return iotDev.save();
};

/**
 * Create iotdev
 * @param {Object} iotDevBody
 * @param {ObjectId} userId
 * @returns {Promise<Array<Promise<IotDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const createIotDev = async (iotDevBody, userId) => {
  const iotDev = new IotDev(iotDevBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!iotDevBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

  if (iotDevBody.namaAnggota1) {
    if (iotDevBody.pathIdentitasAnggota1) {
      if (iotDevBody.namaAnggota2 && !iotDevBody.pathIdentitasAnggota2) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
      }
    } else if (!iotDevBody.pathIdentitasAnggota1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }

  if (!iotDevBody.pathBuktiUploadTwibbon || !iotDevBody.pathBuktiFollowMage || !iotDevBody.pathBuktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }
  const cabang = 'idev';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = '1';

  iotDev.noPeserta = `DCI${noUrutPrefix}${noUrut}`;
  iotDev.price = kode.price + kode.no;
  iotDev.user = user.id;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'iotdev';
  return Promise.all([iotDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Query for iotdevs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryIotDevs = async (filter, options) => {
  const iotDevs = await IotDev.paginate(filter, options);
  return iotDevs;
};

/**
 * Get iotdev by id
 * @param {ObjectId} id
 * @returns {Promise<IotDev>}
 */
const getIotDevById = async (id) => {
  return IotDev.findById(id);
};

/**
 * Update iotdev by id
 * @param {ObjectId} iotDevId
 * @param {Object} updateBody
 * @param {IotDev} iotObj
 * @returns {Promise<IotDev>}
 */
const updateIotDevById = async (iotDevId, updateBody, iotObj = null) => {
  const iotDev = iotObj ?? (await getIotDevById(iotDevId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(iotDev, updateBody);
  if (iotDev.pathIdentitasAnggota1 === null) {
    iotDev.namaAnggota1 = null;
  }
  if (iotDev.pathIdentitasAnggota2 === null) {
    iotDev.namaAnggota2 = null;
  }
  return iotDev.save();
};

/**
 * Delete iotdev by id
 * @param {ObjectId} iotDevId
 * @returns {Promise<IotDev>}
 */
const deleteIotDevById = async (iotDevId, iotDevObj = null, userObj = null) => {
  const iotDev = iotDevObj ?? (await getIotDevById(iotDevId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj ?? (await User.findById(iotDev.user));
  if (user) {
    user.registeredComp = '';
  }
  await Promise.all([iotDev.remove(), user.save()]);
  return iotDev;
};

/**
 * Toggle verification
 * @param {ObjectId} iotDevId
 * @param {IotDev} [iotDevObj=null]
 * @returns {Promise<IotDev>}
 */
const toggleVerif = async (iotDevId, username, iotDevObj = null) => {
  const iotDev = iotDevObj ?? (await getIotDevById(iotDevId));
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return updateIotDevById(
    iotDev.id,
    { isVerified: !iotDev.isVerified, verifiedBy: iotDev.isVerified ? undefined : username },
    iotDev
  );
};

/**
 * Increment tahap
 * @param {ObjectId} iotDevId
 * @returns {Promise<IotDev>}
 */
const incTahap = async (iotDevId) => {
  const iotDev = await getIotDevById(iotDevId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (iotDev.tahap < 3) {
    return updateIotDevById(iotDev.id, { tahap: iotDev.tahap + 1 }, iotDev);
  }
};

/**
 * Decrement tahap
 * @param {ObjectId} iotDevId
 * @returns {Promise<IotDev>}
 */
const decTahap = async (iotDevId) => {
  const iotDev = await getIotDevById(iotDevId);
  if (!iotDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (iotDev.tahap > 1) {
    return updateIotDevById(iotDev.id, { tahap: iotDev.tahap - 1 }, iotDev);
  }
};

module.exports = {
  daftarIotDev,
  uploadProposal,
  queryIotDevs,
  createIotDev,
  getIotDevById,
  getIotDevByUserId,
  getIotDevByNamaTim,
  updateIotDevById,
  updateIotDevByUserId,
  deleteIotDevById,
  toggleVerif,
  incTahap,
  decTahap,
  checkTeamName,
};
