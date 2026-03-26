// This is a "Higher Order Function" that returns a middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user was populated by the 'protect' middleware previously
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: `Role (${req.user.role}) is not authorized to access this resource` 
      });
    }
    next();
  };
};