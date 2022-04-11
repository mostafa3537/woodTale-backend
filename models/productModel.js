const mongoose = require('mongoose');
// const slugify = require('slugify');
// const validator = require('validator');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      // required: [true, 'A product must have a name'],
      // unique: true,
      trim: true,
    },
    // slug: String,

    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10, // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      // required: [true, 'A product must have a price'],
    },
    priceDiscount: {
      type: Number,
      // validate: {
      //   validator: function (val) {
      //     // this only points to current doc on NEW document creation
      //     return val < this.price;
      //   },
      //   message: 'Discount price ({VALUE}) should be below regular price',
      // },
    },
    description: {
      type: String,
      trim: true,
      // required: [true, 'A product must have a description'],
    },
    imageCover: {
      type: String,
      // required: [true, 'A product must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// productSchema.index({ price: 1 });
productSchema.index({ price: 1, ratingsAverage: -1 });
// productSchema.index({ slug: 1 });

// // Virtual populate
// productSchema.virtual('reviews', {
//   ref: 'Review',
//   foreignField: 'product',
//   localField: '_id',
// });

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
// productSchema.pre('save', function (next) {
//   this.slug = slugify(this.name, { lower: true });
//   next();
// });

// QUERY MIDDLEWARE
// productSchema.pre('find', function(next) {
productSchema.pre(/^find/, function (next) {
  this.find({ secretProduct: { $ne: true } });

  this.start = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
