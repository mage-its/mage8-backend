const multer = require('multer');
const path = require('path');
const httpStatus = require('http-status');
const sanitizeFilename = require('sanitize-filename');
const kodeBayarService = require('./kodeBayar.service');
const { GameDev, User } = require('../models');
const config = require('../config/config');
const ApiError = require('../utils/ApiError');
const frontendPath = require('../utils/frontendPath');
const { removeFilePaths } = require('../utils/removeFile');
const { isImageOrPdf, isPdf } = require('../utils/isImageOrPdf');

/**
 * Get gamedev by user id
 * @param {ObjectId} user
 * @returns {Promise<GameDev>}
 */
const getGameDevByUserId = async (user) => {
  return GameDev.findOne({ user });
};

/**
 * Get gamedev by nama tim
 * @param {string} namaTim
 * @returns {Promise<GameDev>}
 */
const getGameDevByNamaTim = async (namaTim) => {
  return GameDev.findOne({ namaTim });
};

/**
 * Register gamedev service
 * @param {Object} gameDevBody
 * @param {User} user
 * @returns {Promise<Array<Promise<GameDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const daftarGameDev = async (gameDevBody, user) => {
  const gameDev = new GameDev(gameDevBody);

  if (!gameDevBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

 if(gameDevBody.namaAnggota1)
 {
  if(gameDevBody.pathIdentitasAnggota1)
  {
    if(gameDevBody.namaAnggota2 && !gameDevBody.pathIdentitasAnggota2)
    {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }
  else if(!gameDevBody.pathIdentitasAnggota1){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
  }
 }

  if (!gameDevBody.pathBuktiUploadTwibbon || !gameDevBody.pathBuktiFollowMage || !gameDevBody.pathBuktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }

  gameDev.user = user.id;

  const cabang = gameDevBody.kategori === 'Siswa' ? 'gdevs' : 'gdevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = gameDevBody.kategori === 'Siswa' ? '0' : '1';

  gameDev.noPeserta = `DCG${noUrutPrefix}${noUrut}`;
  gameDev.price = kode.price + kode.no;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'gamedev';
  return Promise.all([gameDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Upload proposal
 * @param {ObjectId} userId
 * @param {Object} gameDevBody
 * @returns {Promise<GameDev>}
 */
const uploadProposal = async (userId, gameDevBody ) => {
  const gameDev = await getGameDevByUserId(userId);
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  if (gameDev.tahap !== 1) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      `Upload proposal hanya saat tahap 1, anda sekarang di tahap ${gameDev.tahap}`
    );
  }
  if (!gameDevBody.pathProposal) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'File proposal harus diupload');
  }
  // Delete proposal if exist
  return gameDev.save();
};

/**
 * Update gamedev by userId
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @param {GameDev} gameObj
 * @returns {Promise<GameDev>}
 */
const updateGameDevByUserId = async (userId, updateBody, gameObj = null) => {
  const gameDev = gameObj ?? (await getGameDevByUserId(userId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(gameDev, updateBody);
  if (gameDev.pathIdentitasAnggota1 === null) {
    gameDev.namaAnggota1 = null;
  }
  if (gameDev.pathIdentitasAnggota2 === null) {
    gameDev.namaAnggota2 = null;
  }
  return gameDev.save();
};

/**
 * Create gamedev
 * @param {Object} gameDevBody
 * @param {ObjectId} userId
 * @returns {Promise<Array<Promise<GameDev>, Promise<User>, Promise<KodeBayar>>>}
 */
const createGameDev = async (gameDevBody, userId) => {
  const gameDev = new GameDev(gameDevBody);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!gameDevBody.pathIdentitasKetua) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas ketua WAJIB diberikan');
  }

 if(gameDevBody.namaAnggota1)
 {
  if(gameDevBody.pathIdentitasAnggota1)
  {
    if(gameDevBody.namaAnggota2 && !gameDevBody.pathIdentitasAnggota2)
    {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
    }
  }
  else if(!gameDevBody.pathIdentitasAnggota1){
    throw new ApiError(httpStatus.BAD_REQUEST, 'Identitas semua anggota WAJIB diberikan');
  }
 }

  if (!gameDevBody.pathBuktiUploadTwibbon || !gameDevBody.pathBuktiFollowMage || !gameDevBody.pathBuktiRepostStory) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
  }
  const cabang = gameDevBody.kategori === 'Siswa' ? 'gdevs' : 'gdevm';

  const kode = await kodeBayarService.getKodeBayarByCabang(cabang);

  const noUrut = kode.no.toString().padStart(3, '0');

  const noUrutPrefix = gameDevBody.kategori === 'Siswa' ? '0' : '1';

  gameDev.noPeserta = `DCG${noUrutPrefix}${noUrut}`;
  gameDev.price = kode.price + kode.no;
  gameDev.user = user.id;

  // eslint-disable-next-line no-param-reassign
  user.registeredComp = 'gamedev';
  return Promise.all([gameDev.save(), user.save(), kodeBayarService.incNoUrut(cabang, kode)]);
};

/**
 * Query for gamedevs
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryGameDevs = async (filter, options) => {
  const gameDevs = await GameDev.paginate(filter, options);
  return gameDevs;
};

/**
 * Get gamedev by id
 * @param {ObjectId} id
 * @returns {Promise<GameDev>}
 */
const getGameDevById = async (id) => {
  return GameDev.findById(id);
};

/**
 * Update gamedev by id
 * @param {ObjectId} gameDevId
 * @param {Object} updateBody
 * @param {GameDev} gameObj
 * @returns {Promise<GameDev>}
 */
const updateGameDevById = async (gameDevId, updateBody, gameObj = null) => {
  const gameDev = gameObj ?? (await getGameDevById(gameDevId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  Object.assign(gameDev, updateBody);
  if (gameDev.pathIdentitasAnggota1 === null) {
    gameDev.namaAnggota1 = null;
  }
  if (gameDev.pathIdentitasAnggota2 === null) {
    gameDev.namaAnggota2 = null;
  }
  return gameDev.save();
};

/**
 * Delete gamedev by id
 * @param {ObjectId} gameDevId
 * @returns {Promise<GameDev>}
 */
const deleteGameDevById = async (gameDevId, gameDevObj = null, userObj = null) => {
  const gameDev = gameDevObj ?? (await getGameDevById(gameDevId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Peserta tidak ditemukan');
  }
  const user = userObj ?? (await User.findById(gameDev.user));
  if (user) {
    user.registeredComp = '';
  }
  await Promise.all([gameDev.remove(), user.save()]);
  return gameDev;
};

/**
 * Toggle verification
 * @param {ObjectId} gameDevId
 * @param {GameDev} [gameDevObj=null]
 * @returns {Promise<GameDev>}
 */
const toggleVerif = async (gameDevId, username, gameDevObj = null) => {
  const gameDev = gameDevObj ?? (await getGameDevById(gameDevId));
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }
  return updateGameDevById(gameDev.id, { isVerified: !gameDev.isVerified, verifiedBy: gameDev.isVerified? undefined:username }, gameDev);
};

/**
 * Increment tahap
 * @param {ObjectId} gameDevId
 * @returns {Promise<GameDev>}
 */
const incTahap = async (gameDevId) => {
  const gameDev = await getGameDevById(gameDevId);
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (gameDev.tahap < 3) {
    return updateGameDevById(gameDev.id, { tahap: gameDev.tahap + 1 }, gameDev);
  }
};

/**
 * Decrement tahap
 * @param {ObjectId} gameDevId
 * @returns {Promise<GameDev>}
 */
const decTahap = async (gameDevId) => {
  const gameDev = await getGameDevById(gameDevId);
  if (!gameDev) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Not Found');
  }

  if (gameDev.tahap > 1) {
    return updateGameDevById(gameDev.id, { tahap: gameDev.tahap - 1 }, gameDev);
  }
};

module.exports = {
  daftarGameDev,
  uploadProposal,
  queryGameDevs,
  createGameDev,
  getGameDevById,
  getGameDevByUserId,
  getGameDevByNamaTim,
  updateGameDevById,
  updateGameDevByUserId,
  deleteGameDevById,
  toggleVerif,
  incTahap,
  decTahap,
};
