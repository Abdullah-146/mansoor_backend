import Dish from '../../models/Dish.js';

// Create a new dish
async function createDish(req, res, next) {
  try {
    const { userId, dishName, dishPrice } = req.body;
    console.log(req.body);
    if (userId && dishName && dishPrice) {
      const dish = new Dish(req.body);
      const savedDish = await dish.save();
      res.status(200).send(savedDish);
    } else {
      throw new Error('Please provide all fields');
    }
  } catch (error) {
    next(error);
  }
}

// Read a single dish by dishId
async function getDishById(req, res, next) {
  try {
    const { id } = req.params;
    if (id) {
      const dish = await Dish.findById(id);
      res.status(200).send(dish);
    } else {
      throw new Error('Please provide a dish Id');
    }
  } catch (error) {
    next(error);
  }
}

// Read all dishes
async function getAllDishes(req, res, next) {
  try {
    const dishes = await Dish.find();
    res.status(200).send(dishes);
  } catch (error) {
    next(error);
  }
}

// Update a dish by dishId
async function updateDishById(req, res, next) {
  try {
    const { id } = req.params;
    if (id) {
      const dish = await Dish.findByIdAndUpdate({ id }, req.body, {
        new: true,
      });
      res.status(200).send(dish);
    } else {
      throw new Error('Please provide a dish Id');
    }
  } catch (error) {
    next(error);
  }
}

// Delete a dish by dishId
async function deleteDishById(req, res, next) {
  try {
    const { id } = req.params;
    if (id) {
      const dish = await Dish.findByIdAndDelete(id);
      res.status(200).send(dish);
    } else {
      throw new Error('Please provide a dish Id');
    }
  } catch (error) {
    next(error);
  }
}

export {
  createDish,
  getDishById,
  getAllDishes,
  updateDishById,
  deleteDishById,
};
