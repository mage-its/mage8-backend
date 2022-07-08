const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const linkShortenerSchema = mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    link: {
      type: String,
      required: true,
    },
    createdBy: {
      type: String,
      default: ' ',
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
linkShortenerSchema.plugin(toJSON);
linkShortenerSchema.plugin(paginate);

linkShortenerSchema.statics.isSlugTaken = async function (slug) {
  const slugs = await this.findOne({ slug });
  return !!slugs;
};

/**
 * @typedef LinkShortener
 */
const LinkShortener = mongoose.model('LinkShortener', linkShortenerSchema);

module.exports = LinkShortener;
