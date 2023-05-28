import express from 'express';
import {
  createUser,
  findUser,
  updateUser,
  deleteUser,
  getAllUsers,
  findBooking,
  deleteBooking,
  getAllBookings,
  verifyBooking,
  getRevenue,
} from '../../controllers/Admin/index.js';
import {
  createDeal,
  getDealById,
  getAllDeals,
  updateDealById,
  deleteDealById,
} from '../../controllers/Deal/index.js';
import {
  createDish,
  getDishById,
  getAllDishes,
  updateDishById,
  deleteDishById,
} from '../../controllers/Dish/index.js';
import { authorize, isAdmin } from '../../middlewares/index.js';

const router = express();

// Admin Routes for user operations
router.post('/users', authorize, isAdmin, createUser);
router.get('/users/:id', authorize, isAdmin, findUser);
router.put('/users/:id', authorize, isAdmin, updateUser);
router.delete('/users/:id', authorize, isAdmin, deleteUser);
router.get('/users', authorize, isAdmin, getAllUsers);

// Admin Routes for booking operations
router.get('/bookings/:id', authorize, isAdmin, findBooking);
router.delete('/bookings/:id', authorize, isAdmin, deleteBooking);
router.get('/bookings', authorize, isAdmin, getAllBookings);
router.patch('/bookings/:id', authorize, isAdmin, verifyBooking);
router.get('/revenue', authorize, isAdmin, getRevenue);

// Admin Routes for Deal operations
router.post('/deals', authorize, isAdmin, createDeal);
router.get('/deals/:id', authorize, isAdmin, getDealById);
router.get('/deals', authorize, isAdmin, getAllDeals);
router.put('/deals/:id', authorize, isAdmin, updateDealById);
router.delete('/deals/:id', authorize, isAdmin, deleteDealById);

// Admin Routes for Dishes operations
router.post('/dishes', authorize, isAdmin, createDish);
router.get('/dishes/:id', authorize, isAdmin, getDishById);
router.get('/dishes', authorize, isAdmin, getAllDishes);
router.put('/dishes/:id', authorize, isAdmin, updateDishById);
router.delete('/dishes/:id', authorize, isAdmin, deleteDishById);

export default router;
