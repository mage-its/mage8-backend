const httpStatus = require('http-status');
const { options, object } = require('joi');
const { Workshop } = require('../models');
const ApiError = require('../utils/ApiError');
const frontendPath = require('../utils/frontendPath');
const multer = require('multer');
const { isImageOrPdf} = require('../utils/isImageOrPdf');
const path = require('path');
const config = require('../config/config');

const storage = multer.diskStorage({
    destination: path.join(config.frontend, 'uploads/workshop/daftar'),
    filename: (req, file, cb) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
      cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    },
});
  
const upload = multer({
    storage,
    limits: {
      fileSize: 2 * 1024 * 1024, // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
      isImageOrPdf(file, cb);
    },
});

const multiUploads = upload.fields([
    { name: 'buktiFollow', maxCount: 1 },
    { name: 'buktiShare', maxCount: 1 },
]);

const daftarWorkshop = async(daftarBody, files) => {
    const workshop = new Workshop(daftarBody);
    if (!files.buktiFollow || !files.buktiShare) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Persyaratan registrasi wajib diupload');
      }
    
    workshop.pathBuktiFollow = frontendPath(files.buktiFollow[0].path);
    workshop.pathBuktiShare = frontendPath(files.buktiShare[0].path);
    return Promise.all([workshop.save()]);
}

const queryWorkshop = async(filter,options)=>{
    return await Workshop.paginate(filter ,options);
};

module.exports = {
    daftarWorkshop,
    multiUploads,
    queryWorkshop,
};