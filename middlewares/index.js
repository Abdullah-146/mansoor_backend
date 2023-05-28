/**
 * This is error middleware, when ever error is thrown
 * it will be caught by this middleware in the middleware
 * chain
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const errorMiddleware = (error, req, res, next) => {
  if (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ success: false, errors: error?.errors });
    }
    res.status(500).json({
      success: false,
      errors: [error?.message || 'Something went wrong'],
    });
  }
  next();
};

/**
 * This middleware is responsible for authenticating user
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const authorize = (req, res, next) => {
  try {
    if (req.session.user && req.cookies['user']) {
      req.userId = req.session.user._id;
      req.userRole = req.session.user.role;
      next();
    } else {
      throw new Error('Your session has been expired.');
    }
  } catch (err) {
    next(err);
  }
};

/**
 * This middleware checks if route is associcated with admin or not
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const isAdmin = (req, res, next) => {
  if (req.userRole === 'admin') {
    next();
  } else {
    throw new Error('You are not authorized to perform this action');
  }
};

export { errorMiddleware, authorize, isAdmin };
