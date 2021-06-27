const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const gameDevSchema = mongoose.Schema(
  {
    noPeserta: {
      type: String,
      required: true,
      index: true,
    },
    namaTim: {
      type: String,
      required: true,
      trim: true,
    },
    namaKetua: {
      type: String,
      required: true,
      trim: true,
    },
    hpKetua: {
      type: String,
      required: true,
      trim: true,
    },
    waKetua: {
      type: String,
      required: true,
      trim: true,
    },
    lineKetua: {
      type: String,
      required: true,
      trim: true,
    },
    pathIdentitasKetua: {
      type: String,
      required: true,
    },
    namaAnggota1: {
      type: String,
      trim: true,
      default: null,
    },
    namaAnggota2: {
      type: String,
      trim: true,
      default: null,
    },
    pathIdentitasAnggota1: {
      type: String,
      default: null,
    },
    pathIdentitasAnggota2: {
      type: String,
      default: null,
    },
    asalInstansi: {
      type: String,
      required: true,
      trim: true,
    },
    alamatInstansi: {
      type: String,
      required: true,
      trim: true,
    },
    pathSuratKeteranganSiswa: {
      type: String,
      required: true,
    },
    asalKota: {
      type: String,
      required: true,
    },
    asalInfo: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    pathBuktiBayar: {
      type: String,
      default: '',
    },
    statusBayar: {
      type: String,
      enum: ['Not Verified', 'Verified'],
      default: 'Not Verified',
    },
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      private: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
gameDevSchema.plugin(toJSON);
gameDevSchema.plugin(paginate);

/**
 * @typedef GameDev
 */
const GameDev = mongoose.model('GameDev', gameDevSchema);

module.exports = GameDev;
