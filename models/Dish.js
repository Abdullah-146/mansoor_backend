import mongoose from 'mongoose';
const dishSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
  },
  dishName: {
    type: String,
    required: true,
  },
  dishPrice: {
    type: Number,
    required: true,
  },
  dishImage: {
    type: String,
    default: 'https://picsum.photos/200', // Random image from Picsum, size: 200x200
  },
});

const Dish = mongoose.model('Dish', dishSchema);
export default Dish;
