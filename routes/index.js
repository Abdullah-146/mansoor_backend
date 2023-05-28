import express from 'express';
const router = express();
import { getAllDeals } from '../controllers/Deal/index.js';
import { getAllDishes } from '../controllers/Dish/index.js';

router.get('/deals', getAllDeals);
router.get('/dishes', getAllDishes);
router.get('/', (req, res) => {
  res.status(200).json('Server is up');
});

export default router;
