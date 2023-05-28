import mongoose from 'mongoose';
const dealSchema = new mongoose.Schema({
  dealName: {
    type: String,
    required: true,
    default: '',
  },
  dealPrice: {
    type: Number,
    required: true,
  },
  dealItems: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish',
      },
    ],
    required: true,
  },
  dealImage: {
    type: String,
    default:
      'https://burst.shopifycdn.com/photos/flatlay-iron-skillet-with-meat-and-other-food.jpg?width=1200&format=pjpg&exif=1&iptc=1',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

export default mongoose.model('Deal', dealSchema);
