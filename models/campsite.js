const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose); // This will load the new currency type to mongoose so that it is available for
// mongoose Schema's to use
const Currency = mongoose.Types.Currency;

const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// create new schema and instantiate new Object
// first param - 1st arg is an object that contains the definition for the schema via the objects properties
// second param - timestamps set to true will cause mongoose to add two properties called: UpdatedAt & CreatedAt
// mongoose will manage those properties for us
const campsiteSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    elevation: {
      type: Number,
      required: true,
    },
    cost: {
      type: Currency,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    comments: [commentSchema], // every campsite doc will be able to contain multiple comment docs stored in an array
  },
  {
    timestamps: true,
  }
);

const Campsite = mongoose.model('Campsite', campsiteSchema); // creates as Model named Campsite, being used for the
// collection called campsite -- returns constructor function
module.exports = Campsite;
