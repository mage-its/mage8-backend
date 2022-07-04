const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');


const webinarSchema = mongoose.Schema(
  {
      nama: {
        type: String,
        required: true,
        unique: true
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
webinarSchema.plugin(toJSON);
webinarSchema.plugin(paginate)

/**
 * @typedef 
 */
const WebinarSchema = mongoose.model('Webinar', webinarSchema);

module.exports = WebinarSchema;