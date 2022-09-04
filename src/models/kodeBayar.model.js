const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const kodeBayarSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
      unique: true,
      enum: ['olim', 'gdevu', 'adevu'],
    },
    no: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
    isPaymentClose: {
      type: Boolean,
      default: false,
    },
    isProposalClose: {
      type: Boolean,
      default: false,
    },
    isKaryaClose: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
kodeBayarSchema.plugin(toJSON);
kodeBayarSchema.plugin(paginate);

/**
 * @typedef KodeBayar
 */
const kodeBayar = mongoose.model('KodeBayar', kodeBayarSchema);

module.exports = kodeBayar;
