const yup = require('yup');

const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;

const loginSchema = yup.object({
  body: yup.object({
    username: yup.string()
      .trim()
      .required('Username is required')
      .min(3, 'Username must be at least 3 characters'),
    password: yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
  }),
});

const signupSchema = yup.object({
  body: yup.object({
    username: yup.string()
      .trim()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must be less than 50 characters')
      .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
      .required('Username is required'),
    email: yup.string()
      .email('Invalid email format')
      .required('Email is required')
      .max(100, 'Email must be less than 100 characters'),
    password: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .max(100, 'Password must be less than 100 characters')
      .matches(passwordRules, {
        message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      })
      .required('Password is required'),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required('Please confirm your password'),
    fullName: yup.string()
      .trim()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be less than 100 characters')
      .matches(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces')
      .required('Full name is required'),
    signupCode: yup.string()
      .required('Signup code is required')
      .min(6, 'Invalid signup code')
      .max(50, 'Invalid signup code'),
  }),
});

const contactSchema = yup.object({
  body: yup.object({
    name: yup.string()
      .trim()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .required('Name is required'),
    email: yup.string()
      .email('Invalid email format')
      .required('Email is required'),
    subject: yup.string()
      .trim()
      .min(3, 'Subject must be at least 3 characters')
      .max(200, 'Subject must be less than 200 characters')
      .required('Subject is required'),
    message: yup.string()
      .trim()
      .min(10, 'Message must be at least 10 characters')
      .max(1000, 'Message must be less than 1000 characters')
      .required('Message is required'),
  }),
});

module.exports = {
  loginSchema,
  signupSchema,
  contactSchema,
};
