const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const workshopSchema = mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
      unique: true,
    },
    asalInstansi: {
      type: String,
      required: true,
    },
    userIG: {
      type: String,
      required: true,
    },
    sumberInfo: {
      type: String,
      required: true,
    },
    pathBuktiFollow: {
      type: String,
      required: true,
    },
    pathBuktiShare: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
workshopSchema.plugin(toJSON);
workshopSchema.plugin(paginate);

/**
 * @typedef
 */
const WorkshopSchema = mongoose.model('Workshop', workshopSchema);

module.exports = WorkshopSchema;
