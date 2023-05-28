import User from '../../models/User.js';
import Booking from '../../models/Booking.js';
import stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripeClient = stripe(process.env.STRIPE_PRIVATE_KEY);
import { compare } from '../../utils/index.js';

/**
 * This function logs in user by validates user credentials
 * it will set cookie if user logged in successfully
 * @param {*} req
 * @param {*} res
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email: email });
      if (user) {
        // compare passwords now
        if (await compare(password, user.password)) {
          // Initalize Session
          req.session.user = user;

          // sending response
          res.status(200).json({
            success: true,
            user,
          });
        } else {
          throw new Error('Incorrect Password');
        }
      } else {
        throw new Error("Email doesn't exist");
      }
    } else {
      throw new Error('Please provide all fields');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function is for logging out user
 * by destroying session and clearing cookies
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const logout = async (req, res, next) => {
  try {
    if (req.session.user && req.cookies['user']) {
      res.clearCookie('user');
      req.session.destroy(null);
      res.status(200).send('Logged Out successfully');
    } else {
      throw new Error('Your session has been expired.');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function is for creating booking,
 * if already exists, it will check for time
 * availablitiy, if found new booking will be created
 * else error will be thrown.
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createBooking = async (req, res, next) => {
  try {
    const {
      userId,
      date,
      timeSlot,
      dealId,
      noPersons,
      themeColor,
      totalPrice,
    } = req.body;
    if (
      userId &&
      date &&
      timeSlot &&
      dealId &&
      noPersons &&
      themeColor &&
      totalPrice
    ) {
      if (req.userId !== userId) {
        throw new Error('Unauthorized Access');
      }
      const userBooking = await Booking.findOne({ user: userId, date });
      if (!userBooking) {
        const newBooking = new Booking({
          user: userId,
          date,
          deal: dealId,
          noPersons,
          themeColor,
          totalPrice,
          isUpdate: false, // new flag to indicate whether a booking is an update or not
        });
        if (timeSlot === 1) {
          newBooking.timeSlot1 = false;
        } else if (timeSlot === 2) {
          newBooking.timeSlot2 = false;
        }
        const bookingCreated = await newBooking.save();
        res.status(201).json({
          success: true,
          message: 'Booking saved successfully',
          booking: await Booking.findOne(bookingCreated._id)
            .populate('user')
            .select('-password'),
        });
      } else {
        if (timeSlot === 1 && !userBooking.timeSlot1) {
          throw new Error('Booking not available for this time slot');
        } else if (timeSlot === 2 && !userBooking.timeSlot2) {
          throw new Error('Booking not available for this time slot');
        } else {
          const newBooking = new Booking({
            user: userId,
            date,
            deal: dealId,
            noPersons,
            themeColor,
            totalPrice,
            isUpdate: true, // set the flag to indicate that this is an update
          });
          if (timeSlot === 1) {
            newBooking.timeSlot1 = false;
            newBooking.timeSlot2 = userBooking.timeSlot2;
          } else if (timeSlot === 2) {
            newBooking.timeSlot1 = userBooking.timeSlot1;
            newBooking.timeSlot2 = false;
          }
          const bookingCreated = await newBooking.save();

          res.status(201).json({
            success: true,
            message: 'Booking updated successfully',
            booking: await Booking.findOne(bookingCreated._id)
              .populate('user')
              .select('-password'),
          });
        }
      }
    } else {
      throw new Error('Please provide all fields');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This function returns user bookigns
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const myBookings = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error('User Id is required');
    } else {
      const bookings = await Booking.find({ user: id }).populate(
        'user',
        '-password'
      );
      res.status(200).send(bookings);
    }
  } catch (error) {
    next(error);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const makePayment = async (req, res, next) => {
  const { amount, token, bookingID } = req.body;
  try {
    if (amount && token) {
      const charge = await stripeClient.charges.create({
        amount,
        currency: 'usd',
        source: token.id,
      });
      // Also Update Status of Booking
      const updatedBooking = await Booking.findByIdAndUpdate(
        bookingID,
        { isBooked: true },
        { new: true }
      ).populate('user', '-password');
      res.status(200).json({
        message: 'Payment successful',
        charge,
        booking: updatedBooking,
      });
    } else {
      throw new Error('Please provide all fields');
    }
  } catch (error) {
    next(new Error('Payment failed'));
  }
};

const getPhotographers = async (req, res, next) => {
  try {
    const photographers = await User.find({ role: 'photographer' }).select(
      '-password'
    );
    res.status(200).send(photographers);
  } catch (error) {
    next(error);
  }
};
const getCaterers = async (req, res, next) => {
  try {
    const caterers = await User.find({ role: 'caterer' }).select('-password');
    res.status(200).send(caterers);
  } catch (error) {
    next(error);
  }
};
export {
  login,
  logout,
  createBooking,
  myBookings,
  makePayment,
  getPhotographers,
  getCaterers,
};
