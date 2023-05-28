import User from '../../models/User.js';
import Booking from '../../models/Booking.js';
import { sendEmail } from '../../services/mailer/index.js';
import { format, getMonth } from 'date-fns';

// Defining User Operations that admin can perform

/**
 * This action is for creating user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const createUser = async (req, res, next) => {
  try {
    const {
      userName,
      email,
      password,
      role,
      yearOfExperience,
      serviceCharges,
    } = req.body;
    if (userName && email && password) {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error('User already exists');
      } else {
        // Now we will make sure valid fields are entered when creating a user
        if (
          (!role || role === 'admin' || role === 'default') &&
          (yearOfExperience || serviceCharges)
        )
          throw new Error('Please provide valid fields.');
        if (
          (role === 'photographer' || role === 'caterer') &&
          (!yearOfExperience || !serviceCharges)
        )
          throw new Error(
            'Please make sure you have included yearOfExperience and serviceCharges fields.'
          );

        // Field Checks are done, now we can create user safely
        const newUser = new User(req.body);
        await newUser.save();

        // creating session
        req.session.user = newUser;

        // sending Mail
        const mailOpts = {
          from: process.env.EMAIL_SERVICE_USERNAME,
          to: newUser.email,
          subject: 'Registered Successfully.',
          text: 'Thanks for registering with Bookify.',
        };
        sendEmail(mailOpts);

        // sending response
        res.status(201).json({
          success: true,
          message: 'Created Successfully',
          user: newUser,
        });
      }
    } else {
      throw new Error('Please provide all fields');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This action is for finding user based on params id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const findUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const user = await User.findById(id).select('-password');
      if (user) {
        res.status(200).json({ success: true, user: user });
      } else {
        res.status(404).json({ success: false, message: 'User Not Found' });
      }
    } else {
      throw new Error('Please Provide valid id');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * this action is for updating a user based on params id
 * also it makes sure only those fields get updated
 * which are associated with roles
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { yearOfExperience, serviceCharges } = req.body;
    if (id) {
      // find user
      const user = await User.findById(id);
      if (
        user.role !== 'photographer' &&
        user.role !== 'caterer' &&
        (serviceCharges || yearOfExperience)
      ) {
        throw new Error('Not allowed to set these fields');
      }
      const updatedUser = await User.findByIdAndUpdate(id, req.body, {
        new: true,
      }).select('-password');
      if (updateUser) {
        res.status(200).json({
          success: true,
          message: 'Updated Successfully',
          user: updatedUser,
        });
      } else {
        throw new Error('Unable to update user');
      }
    } else {
      throw new Error('Please Provide valid id');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This action is for deleting a user based on params id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      // Delete this use bookings too if any
      await Booking.deleteMany({ user: id });

      const user = await User.deleteOne({ _id: id });
      if (user && user.deletedCount > 0) {
        res
          .status(200)
          .json({ success: true, message: 'Removed Successfully', id });
      } else {
        res.status(404).json({ success: false, message: 'User Not Found' });
      }
    } else {
      throw new Error('Please Provide valid id');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * this action is for fetching all users
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: { $not: { $eq: 'admin' } } }).select(
      '-password'
    );
    if (users) {
      res.status(200).send(users);
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
          if (timeSlot === 1) {
            userBooking.timeSlot1 = false;
          } else if (timeSlot === 2) {
            userBooking.timeSlot2 = false;
          }
          const bookingCreated = await userBooking.save();

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
 * This action is for finding Booking
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const findBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const booking = await Booking.findById(id).populate('user', 'name email');
      if (booking) {
        res
          .status(200)
          .json({ success: true, message: 'Found Successfully', booking });
      } else {
        res.status(404).json({ success: false, message: 'Booking Not Found' });
      }
    } else {
      throw new Error('Please Provide valid id');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This action is for deleting a booking
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const deleteBooking = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (id) {
      const booking = await Booking.deleteOne({ _id: id });
      if (booking && booking.deletedCount > 0) {
        res.status(200).json({
          success: true,
          message: 'Removed Successfully',
          id,
        });
      } else {
        res.status(404).json({ success: false, message: 'Booking Not Found' });
      }
    } else {
      throw new Error('Please Provide valid id');
    }
  } catch (error) {
    next(error);
  }
};

/**
 * This action returns all bookings
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({}).populate('user', '-password');
    res.status(200).send(bookings);
  } catch (error) {
    next(error);
  }
};

/**
 * This action is for confirming Booking
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const verifyBooking = async (req, res, next) => {
  const { id } = req.params;

  try {
    if (id) {
      const verifiedBooking = await Booking.findByIdAndUpdate(
        id,
        {
          isBooked: true,
        },
        { new: true }
      ).populate('user', '-password');
      // sending Mail
      const mailOpts = {
        from: process.env.EMAIL_SERVICE_USERNAME,
        to: verifiedBooking.user.email,
        subject: 'Booking Verified',
        text: 'Your booking has been verified.',
      };
      sendEmail(mailOpts);
      res.status(200).json({
        success: true,
        message: 'Booking has been placed',
        booking: verifiedBooking,
      });
    } else
      res
        .status(404)
        .json({ success: false, message: 'No such Booking Found' });
  } catch (error) {
    next(error);
  }
};

const getRevenue = async (req, res) => {
  try {
    const revenueByMonth = await Booking.aggregate([
      {
        $group: {
          _id: { $month: '$date' },
          revenue: { $sum: '$totalPrice' },
        },
      },
    ]);

    const bookings = await Booking.find({});
    let totalBookings = bookings.length;
    let totalRevenue = bookings.reduce((accumulator, currentValue) => {
      return accumulator + Number.parseInt(currentValue.totalPrice);
    }, 0);
    const revenueMap = {};
    revenueByMonth.forEach((item) => {
      const month = format(new Date().setMonth(item._id - 1), 'MMMM');
      revenueMap[month] = item.revenue;
    });

    const months = Array.from({ length: 12 }, (_, index) =>
      format(new Date().setMonth(index), 'MMMM')
    );

    const response = months.map((month) => ({
      month,
      revenue: revenueMap[month] || 0,
    }));

    res.status(200).send({ response, totalBookings, totalRevenue });
  } catch (error) {
    console.error('Error fetching revenue by month:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export {
  createUser,
  findUser,
  updateUser,
  deleteUser,
  getAllUsers,
  createBooking,
  findBooking,
  getAllBookings,
  deleteBooking,
  verifyBooking,
  getRevenue,
};
