import express from 'express';
import {
  getCaterers,
  getPhotographers,
  login,
  logout,
  makePayment,
  myBookings,
} from '../../controllers/User/index.js';
import { createUser, updateUser } from '../../controllers/Admin/index.js';
import { authorize } from '../../middlewares/index.js';
import { createBooking } from '../../controllers/User/index.js';
import { createDeal } from '../../controllers/Deal/index.js';
const router = express();

// Registering routes
router.post('/register', createUser);
router.post('/login', login);
router.delete('/logout', logout);

router.post('/bookings', authorize, createBooking);
router.get('/bookings/:id', authorize, myBookings);
router.post('/charge', authorize, makePayment);
router.get('/photographers', authorize, getPhotographers);
router.get('/caterers', authorize, getCaterers);
router.put('/:id', authorize, updateUser);
router.post('/deals', authorize, createDeal);

export default router;
