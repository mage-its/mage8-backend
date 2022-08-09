const httpStatus = require('http-status');
const kodeBayarService = require('./kodeBayar.service');
const { AppDev, User } = require('../models');
const ApiError = require('../utils/ApiError');
/**
 * Get appdev by user id
 * @param {ObjectId} user
 * @returns {Promise<AppDev>}
 */
const getAppDevByUserId = async (user) => {
  return AppDev.findOne({ user });
};

/**
 * Get appdev by nama tim
 * @param {string} namaTim
 * @returns {Promise<AppDev>}
 */
const getAppDevByNamaTim = async (namaTim) => {
  return AppDev.findOne({ namaTim });
};

/**
 * Register appdev service
 * @param {Object} appDevBody
 * @param {Object} updateBody
 * @param {User} user
 * @returns {Promise<Array<Promise<AppDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const daftarAppDev = async (appDevBody, user) => {
  const appDev = new AppDev(appDevBody);

  if (!appDevBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

  if (appDevBody.namaAnggota1) {
    if (appDevBody.pathIdentitasAnggota1) {
      if (appDevBody.namaAnggota2 && !appDevBody.pathIdentitasAnggota2) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
      }
    } else if (!appDevBody.pathIdentitasAnggota1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }

  if (!appDevBody.pathBuktiUploadTwibbon || !appDevBody.pathBuktiFollowMage || !appDevBody.pathBuktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }

  appDev.user = user.id;

  const cabang = appDevBody.kategori === 'Siswa' ? 'adevs' : 'adevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = appDevBody.kategori === 'Siswa' ? 'S' : 'M';

  appDev.noPeserta = `DCA${noUrutPrefix}${noUrut}`;
  appDev.price = kode.price + kode.no;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'appdev';
  return Promise.all([appDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

const checkTeamName = async (namaTim) => {
  const appDev = await AppDev.findOne({ namaTim });
  if (appDev) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Nama tim sudah terdaftar');
  }
};

/**
 * Upload proposal
 * @param {ObjectId} userId
 * @param {object} requestBody
 * @returns {Promise<AppDev>}
 */
const uploadProposal = async (userId, requestBody) => {
  const appDev = await getAppDevByUserId(userId);
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  if (appDev.tahap !== 1) {
    throw new ApiError(httpStatus.BAD_REQUEST, `Upload proposal hanya saat tahap 1, anda sekarang di tahap ${appDev.tahap}`);
  }
  if (!requestBody.pathProposal) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File proposal harus diupload');
  }
  appDev.pathProposal = requestBody.pathProposal;
  return appDev.save();
};

/**
 * Update appdev by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {AppDev} appObj
 * @returns {Promise<AppDev>}
 */
const updateAppDevByUserId = async (userId, updateBody, appObj = null) => {
  const appDev = appObj ?? (await getAppDevByUserId(userId));
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(appDev, updateBody);
  if (appDev.pathIdentitasAnggota1 === null) {
    appDev.namaAnggota1 = null;
  }
  if (appDev.pathIdentitasAnggota2 === null) {
    appDev.namaAnggota2 = null;
  }
  return appDev.save();
};

/**
 * Create appdev
 * @param {Object} appDevBody
 * @param {Object} updateBody
 * @param {ObjectId} userId
 * @returns {Promise<Array<Promise<AppDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const createAppDev = async (appDevBody, userId) => {
  const appDev = new AppDev(appDevBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!appDevBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

  if (appDevBody.namaAnggota1) {
    if (appDevBody.pathIdentitasAnggota1) {
      if (appDevBody.namaAnggota2 && !appDevBody.pathIdentitasAnggota2) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
      }
    } else if (!appDevBody.pathIdentitasAnggota1) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }

  if (!appDevBody.pathBuktiUploadTwibbon || !appDevBody.pathBuktiFollowMage || !appDevBody.pathBuktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }
  const cabang = appDevBody.kategori === 'Siswa' ? 'adevs' : 'adevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = appDevBody.kategori === 'Siswa' ? 'S' : 'M';

  appDev.noPeserta = `DCA${noUrutPrefix}${noUrut}`;
  appDev.price = kode.price + kode.no;
  appDev.user = user.id;

  user.registeredComp = 'appdev';
  return Promise.all([appDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Query for appdevs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAppDevs = async (filter, options) => {
  const appDevs = await AppDev.paginate(filter, options);
  return appDevs;
};

/**
 * Get appdev by id
 * @param {ObjectId} id
 * @returns {Promise<AppDev>}
 */
const getAppDevById = async (id) => {
  return AppDev.findById(id);
};

/**
 * Update appdev by id
 * @param {ObjectId} appDevId
 * @param {Object} updateBody
 * @param {AppDev} appObj
 * @returns {Promise<AppDev>}
 */
const updateAppDevById = async (appDevId, updateBody, appObj = null) => {
  const appDev = appObj ?? (await getAppDevById(appDevId));
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(appDev, updateBody);
  if (appDev.pathIdentitasAnggota1 === null) {
    appDev.namaAnggota1 = null;
  }
  if (appDev.pathIdentitasAnggota2 === null) {
    appDev.namaAnggota2 = null;
  }
  return appDev.save();
};

/**
 * Delete appdev by id
 * @param {ObjectId} appdevId
 * @returns {Promise<AppDev>}
 */
const deleteAppDevById = async (appDevId, appDevObj = null, userObj = null) => {
  const appDev = appDevObj ?? (await getAppDevById(appDevId));
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj ?? (await User.findById(appDev.user));
  if (user) {
    user.registeredComp = '';
  }
  await Promise.all([appDev.remove(), user.save()]);
  return appDev;
};

/**
 * Toggle verification
 * @param {ObjectId} appDevId
 * @param {AppDev} [appDevObj=null]
 * @returns {Promise<AppDev>}
 */
const toggleVerif = async (appDevId, username, appDevObj = null) => {
  const appDev = appDevObj ?? (await getAppDevById(appDevId));
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return updateAppDevById(
    appDev.id,
    { isVerified: !appDev.isVerified, verifiedBy: appDev.isVerified ? undefined : username },
    appDev
  );
};

/**
 * Increment tahap
 * @param {ObjectId} appDevId
 * @returns {Promise<AppDev>}
 */
const incTahap = async (appDevId) => {
  const appDev = await getAppDevById(appDevId);
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (appDev.tahap < 3) {
    return updateAppDevById(appDev.id, { tahap: appDev.tahap + 1 }, appDev);
  }
  return appDev;
};

/**
 * Decrement tahap
 * @param {ObjectId} appDevId
 * @returns {Promise<AppDev>}
 */
const decTahap = async (appDevId) => {
  const appDev = await getAppDevById(appDevId);
  if (!appDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (appDev.tahap > 1) {
    return updateAppDevById(appDev.id, { tahap: appDev.tahap - 1 }, appDev);
  }
  return appDev;
};

module.exports = {
  daftarAppDev,
  uploadProposal,
  queryAppDevs,
  createAppDev,
  getAppDevById,
  getAppDevByUserId,
  getAppDevByNamaTim,
  updateAppDevById,
  updateAppDevByUserId,
  deleteAppDevById,
  toggleVerif,
  incTahap,
  decTahap,
  checkTeamName,
};
