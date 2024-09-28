const Joi = require('joi');

// Schema cho validation
const userSchema = Joi.object({
  username: Joi.string()
  .min(6)
  .max(30)
  .required()
  .messages({
    'string.empty': 'Username is required.',
    'string.min': 'Username must be at least 6 characters long.',
    'string.max': 'Username must be less than or equal to 30 characters long.',
  }),
  email: Joi.string()
  .email()
  .required()
  .messages({
    'string.empty': 'Email is required.',
    'string.email': 'Email must be a valid email address.',
  }),
  password: Joi.string()
  .min(8)
  .required()
  .messages({
    'string.empty': 'Password is required.',
    'string.min': 'Password must be at least 8 characters long.',
  }),
  fullName: Joi.string()
  .max(100)
  .required()
  .messages({
    'string.empty': 'Full name is required.',
    'string.max': 'Full name must be less than or equal to 100 characters long.',
  }),
  address: Joi.string()
  .max(255)
  .optional()
  .messages({
    'string.max': 'Address must be less than or equal to 255 characters long.',
  }),
  phoneNumber: Joi.string()
  .pattern(/^[0-9\-]+$/)
  .optional()
  .messages({
    'string.pattern.base': 'Phone number can only contain numbers and hyphens.',
  }), // Chỉ cho phép số và dấu -
//   role: Joi.string().valid('customer', 'admin').optional(), // Chỉ cho phép các giá trị xác định
});

const validateRegister = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
};

module.exports = validateRegister;
