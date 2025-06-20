const Joi = require("joi");
const mongoose = require("mongoose");

const bookSchema = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.empty": "Title cannot be empty",
    "string.min": "Title should have at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
    "any.required": "Title is a required field",
  }),
  author: Joi.string()
    .required()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.empty": "Author ID cannot be empty",
      "any.required": "Author ID is required",
      "any.invalid": "Author ID must be a valid MongoDB ID",
    }),
  price: Joi.number().required().positive().precision(2).messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be greater than 0",
    "number.precision": "Price can have maximum 2 decimal places",
    "any.required": "Price is required",
  }),
  description: Joi.string().required().min(10).max(500).messages({
    "string.empty": "Description cannot be empty",
    "string.min": "Description should be at least 10 characters long",
    "string.max": "Description cannot exceed 500 characters",
    "any.required": "Description is required",
  }),
  cover: Joi.string().min(4).max(100).messages({
    "string.min": "Description should be at least 4 characters long",
    "string.max": "Description cannot exceed 100 characters",
  }),
});

const updateBookSchema = Joi.object({
  title: Joi.string().min(3).max(100).messages({
    "string.min": "Title should have at least 3 characters",
    "string.max": "Title cannot exceed 100 characters",
  }),
  author: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "any.invalid": "Author ID must be a valid MongoDB ID",
    }),
  price: Joi.number().positive().precision(2).messages({
    "number.base": "Price must be a valid number",
    "number.positive": "Price must be greater than 0",
    "number.precision": "Price can have maximum 2 decimal places",
  }),
  description: Joi.string().min(10).max(500).messages({
    "string.min": "Description should be at least 10 characters long",
    "string.max": "Description cannot exceed 500 characters",
  }),
  cover: Joi.string().min(4).max(100).messages({
    "string.min": "Description should be at least 4 characters long",
    "string.max": "Description cannot exceed 100 characters",
  }),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

// Common schema properties (reusable)
const baseAuthorSchema = {
  firstName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "First name is required",
    "string.min": "First name must be at least 2 characters",
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  lastName: Joi.string().min(2).max(50).required().messages({
    "string.empty": "Last name is required",
    "string.min": "Last name must be at least 2 characters",
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
  nationality: Joi.string().min(3).max(50).messages({
    "string.min": "Nationality must be at least 3 characters",
    "string.max": "Nationality cannot exceed 50 characters",
  }),
  image: Joi.string()
    .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    .messages({
      "string.pattern.base":
        "Image must be a valid URL (jpg, jpeg, png, gif, webp)",
    }),
};

// CREATE Author Schema (all fields required except image)
const createAuthorSchema = Joi.object({
  ...baseAuthorSchema,
  nationality: baseAuthorSchema.nationality
    .required()
    .messages({ "string.empty": "Nationality is required" }),
});

// UPDATE Author Schema (all fields optional)
const updateAuthorSchema = Joi.object({
  firstName: baseAuthorSchema.firstName.optional(),
  lastName: baseAuthorSchema.lastName.optional(),
  nationality: baseAuthorSchema.nationality.optional(),
  image: baseAuthorSchema.image.optional(),
})
  .min(1)
  .messages({
    "object.min": "At least one field must be provided for update",
  });

const createUserSchema = Joi.object({
  username: Joi.string().trim().min(2).max(200).required().messages({
    "string.base": "Username must be a string",
    "string.empty": "Username is required",
    "string.min": "Username must be at least 2 characters",
    "string.max": "Username cannot exceed 200 characters",
    "any.required": "Username is required",
  }),

  email: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .required()
    .messages({
      "string.base": "Email must be a string",
      "string.empty": "Email is required",
      "string.min": "Email must be at least 3 characters",
      "any.required": "Email is required",
      "string.pattern.base":
        "Email must be a valid format (e.g., user@example.com)",
    }),

  password: Joi.string()
    .trim()
    .min(6)
    .pattern(/[0-9]/) // at least one number
    .pattern(/[!@#$%^&*(),.?":{}|<>]/) // at least one special character
    .required()
    .messages({
      "string.base": "Password must be a string",
      "string.empty": "Password is required",
      "any.required": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.pattern.base":
        "Password must include at least one number and one special character",
    }),

  isAdmin: Joi.boolean().default(false),
});



const updateUserSchema = Joi.object({
  username: Joi.string().trim().min(2).max(200).messages({
    "string.base": "Username must be a string",
    "string.min": "Username must be at least 2 characters",
    "string.max": "Username cannot exceed 200 characters",
  }),

  email: Joi.string()
    .trim()
    .min(3)
    .max(100)
    .pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    .messages({
      "string.base": "Email must be a string",
      "string.min": "Email must be at least 3 characters",
      "string.pattern.base":
        "Email must be a valid format (e.g., user@example.com)",
    }),

  password: Joi.string()
    .trim()
    .min(6)
    .pattern(/[0-9]/, "number")
    .pattern(/[!@#$%^&*(),.?":{}|<>]/, "special")
    .messages({
      "string.base": "Password must be a string",
      "string.min": "Password must be at least 6 characters",
      "string.pattern.name":
        "Password must include at least one number and one special character",
    }),

  isAdmin: Joi.boolean(),
}).min(1); // Require at least one field to update

module.exports = {
  bookSchema,
  updateBookSchema,
  createAuthorSchema,
  updateAuthorSchema,
  createUserSchema,
  updateUserSchema,
};
